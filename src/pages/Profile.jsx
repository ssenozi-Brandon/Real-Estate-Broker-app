import { useState, useEffect } from "react";
import { getAuth,updateProfile } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer,toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'


function Profile() {
  const auth = getAuth();
  const [changeDetails,setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });

  const {name,email} = formData

  useEffect(() => {
    if (auth.currentUser) {
      setFormData({
        name: auth.currentUser.displayName || "",
        email: auth.currentUser.email || ""
      });
    }
    // eslint-disable-next-line
  }, [auth.currentUser]); 

  const onChange = (e) => {
    setFormData((prevState)=>({
    ...prevState,
    [e.target.id]: e.target.value  
    })
    )
  }


  const navigate = useNavigate();

  const onLogout = () => {
    auth.signOut();
    navigate('/sign-in');
  };
  
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
      </main>
      <ToastContainer/>
    </div>
  );
}

export default Profile;
