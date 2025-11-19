import 'bootstrap/dist/css/bootstrap.min.css'


export default function Search(){
    function handlChange(){


    }

    return (<div>
       <form className=" " role="search">
      <input
        className=""
        type="search"
        placeholder="Search for a city"
        aria-label="Search"
      />
      <button className="" type="submit" onChange={handlChange}>
        Search
      </button>
    </form> 
    </div>)
}
