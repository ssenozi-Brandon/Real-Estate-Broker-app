import { useEffect,useState } from "react"
import { useParams } from "react-router-dom"
import { collection, getDocs,query,where,orderBy,limit } from "firebase/firestore"
import { db } from "../firebase.config"
import { ToastContainer,toast } from "react-toastify"
import Spinner from "../components/spinner"
import ListingItem from "../components/ListingItem"

function Offers() {
   const [listings,setListings] = useState(null)
   const [loading, setLoading] = useState(true)

   const params = useParams()

   useEffect(()=>{
    const fetchListings = async ()=>{
     try {
      // get a referrence
      const listingsRef = collection(db,'listings')
      // creating a query
      const q = query(listingsRef,where('offer','==', true ), orderBy('timestamp','desc'),limit(10))

      // execute query
      const querySnap = await getDocs(q)

      const  listings = []
      querySnap.forEach((doc)=>{
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })

      setListings(listings)
      setLoading(false)
      
     } catch (error) {
      toast.error("Couldn't complete Request")
     }
    }
    fetchListings()
   },[])

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          Offers
        </p>
      </header>
      {loading ? ( 
      <Spinner/>
      ) : listings && listings.length >0 ? (
      <>
      <main>
        <ul className="categoryListings">
        {listings.map((listing) => (
          <ListingItem listing={listing.data} id={listing.id} key={listing.id}/>
         ))}
 
        </ul>
      </main>
      
      </>) : <p> No Residencial Offers</p>  }

      <ToastContainer/>
    </div>
  )
}

export default Offers
