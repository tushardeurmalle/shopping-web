import React,{useEffect,useState} from "react";
import {BrowserRouter as Router, Routes,Route,Link} from "react-router-dom"
import axios from "axios";
import Home from "./Component/Home";
import Card from "./Component/Card";
import Signup from "./Component/Signup";
import Login from "./Component/Login";
import "./App.css";
export default function App(){
  const [card,setCard] =useState([]);
  const [user,setUser] = useState(null);
  const addToCard=(product)=>{

    if(!user){
      alert("please login to item add items cart");
      return;
    }
    const exists= card.find((x)=> x.product._id===product._id);
    if(exists){
      setCard(
        card.map((x)=>(
          x.product._id===product._id?{...exists,qty:exists.qty+1}:x)
        )
      )
    }
    else{
      setCard([...card,{product,qty:1}]);
    }
    //setCard([...card,product]);
  }
  const removeFromCard=(id)=>{
    setCard(card.filter((x)=>x.product._id!==id));
  }
  return(
    <Router>
      <nav className="app-nav" >
        <div><b>🛒Shopping App</b></div>
        <div className="app-links" >

          <Link to="/" id="nav-link"><b>🏠︎Home</b></Link>
          <Link to="/card" id="nav-link"><b> 🛍️Cart </b>({card.length})</Link>
          <div id="link-signup">
              {
                user?<span>Welcome,{user.name}</span>:<Link id="nav-link1" to="/login">Login / </Link>
              }
              {
               !user && <Link id="nav-link1" to="/signup"> Signup</Link>
              }
          </div>
          
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home addToCard = {addToCard}/>}/>
        <Route path="/card" element={<Card card={card} onRemove={removeFromCard} />}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/login" element={<Login setUser={setUser}/>}/>
        
      </Routes>
    </Router>
  );

}
