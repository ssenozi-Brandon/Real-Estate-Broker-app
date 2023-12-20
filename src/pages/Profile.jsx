import { useState, useEffect } from "react";
import { getAuth,updateProfile } from "firebase/auth";
import { updateDoc, doc,collection,getDocs,query,where,orderBy, deleteDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer,toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import 'react-toastify/dist/ReactToastify.css';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'


function Profile() {
  const auth = getAuth();
  // eslint-disable-next-line
  const [loading,setLoading] = useState(false)
  // eslint-disable-next-line
  const [listings , setListings] = useState(null)
  const [changeDetails,setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });

  const {name,email} = formData
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserListings = async ()=>{
     const listingsRef = collection(db,'listings')
     const q = query(listingsRef,where('userRef','==',auth.currentUser.uid),orderBy('timestamp','desc'))

     const querSnap = await getDocs(q)
     
     let listings = [];
     querSnap.forEach((doc)=>{
      return listings.push({
        id: doc.id,
        data: doc.data(),
      })
     })

      setListings(listings)
     setLoading(false)
    }

    if (auth.currentUser) {
      setFormData({
        name: auth.currentUser.displayName || "",
        email: auth.currentUser.email || ""
      });
    }

    fetchUserListings()
    // eslint-disable-next-line
  }, [auth.currentUser,auth.currentUser.uid]); 

  
  
  
  const onLogout = () => {
    auth.signOut();
    navigate('/sign-in');
  };
  
  const onChange = (e) => {
    setFormData((prevState)=>({
    ...prevState,
    [e.target.id]: e.target.value  
    })
    )
  }

  const onDelete =  async (listingId)=>{
    if(window.confirm('Are you sure you want to Delete?')){
      await deleteDoc(doc(db,'listings',listingId))
      const updatedListings =  listings.filter((listing)=>listing.id !== listingId)
      setListings(updatedListings)
      toast.success('Listing deleted Successfully')
    }
  }

  const onEdit = (listingId)=> navigate(`/edit-listing/${listingId}`)
  

  const noMatch = () =>{
    // Redirect to login page if not authenticated
    navigate('/sign-in');
  }

  // Check if user is authenticated before rendering the profile
  if (!auth.currentUser) {
    return ( <div className="profile">
    <header className="profileHeader">
      <button onClick={noMatch} className="logOut">sign In</button>;

      </header>
     </div> 
    )
  }

  const  onSubmit = async () =>{
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name
        });
    
        // update in Firestore
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          name
        });
    
        toast.success("Profile details updated successfully");
      }
    } catch (error) {
      toast.error("Couldn't update profile details");
    }
    
  }

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={onLogout}>
          Logout
        </button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
              className="changePersonalDetails"
              onClick={() => {
                changeDetails && onSubmit();
                setChangeDetails((prevState) => !prevState);
              }}
              disabled={!changeDetails && name === auth.currentUser.displayName}
            >
               {changeDetails ? 'Done' : 'Change'}  
          </p>

        </div>

        <div className="profileCard">
          <form>
            <input type="text" id="name" className={!changeDetails ? 'profileName': 'profileNameActive'} disabled={!changeDetails} value={name} onChange={onChange}/>

            <input type="email" id="email" className={!changeDetails ? 'profileEmail': 'profileEmailActive'} disabled={!changeDetails} value={email} onChange={onChange}/>
          </form>
        </div>
        <Link to='/create-listing' className="createListing">
          <img src={homeIcon} alt="home" />
          <p>Sell or Rent your home</p>
          <img src={arrowRight} alt="arrow right" />
        </Link>

        {!loading && listings?.length > 0 && (
          <>
          <p className="listingText">Your Listings</p>
          <ul className="listingsList">
            {listings.map((listing)=>(
             <ListingItem
              key={listing.id} 
              listing={listing.data} 
              id={listing.id}
              onDelete={()=> onDelete(listing.id)}
              onEdit={()=> onEdit(listing.id)}
              />
            ))}
          </ul>
          </>
        )}
      </main>
      <ToastContainer/>
    </div>
  );
}

export default Profile;
