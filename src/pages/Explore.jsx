import {Link} from 'react-router-dom'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'


function Explore() {
  return (
    <div className='explore'>
      <header>
        <p className="pageHeader">Explore</p>
      </header>
     
     {/* slider */}
      <main>
         <p className="exploreCategoryHeading">Categories</p>
         <div className="exploreCategories">
          <Link to='/category/rent'>
            <img src={rentCategoryImage} alt="rent" className='exploreCategoryImg' />
            <p className="exploreCategoryName">Available for Rent</p>
          </Link>
          <Link to='/category/sale'>
            <img src={sellCategoryImage} alt="sell" className='exploreCategoryImg' />
            <p className="exploreCategoryName">Available for sale</p>
          </Link>
         </div>
      </main>
    </div>
  )
}

export default Explore
