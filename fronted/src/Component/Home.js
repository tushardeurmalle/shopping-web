import {useEffect, useState } from "react";
import "./Home.css";
import api from "../api";
export default function Home({addToCard}){
    const [products,setProducts] =useState([]);
        useEffect(()=>{
                api.get("/products")
                    .then((res)=> setProducts(res.data))
                    .catch((err)=>{
                        console.error('/products fetch error:', err.response?.data || err.message || err);
                        setProducts([]);
                    });
        },[]);
    return(
        <div className="home">
            <h1 id="pro">🛒 PRODUCTS</h1>
            <div className="home-main"  >
                {
                    products.map(p=>(
                      <div className="home-content" key={p._id} style={{border:"1px solid #ccc",padding:"10px",margin:"10px"}}>
                        <div className="img-box">
                            <img src={p.image} alt={p.name} />
                        </div>
                        <h3>{p.name}</h3>
                        <p>₹{p.price}</p>
                        <button className="home-btn"  onClick={()=>addToCard(p)}>Add to Cart</button>
                      </div>
                    ))
                }

            </div>
        </div>
    );
}
