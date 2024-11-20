import React from 'react';
import './Caurosel.css'; // Using Caurosel-specific CSS

const Caurosel = () => {

    const linksArray = [
        "https://thumbs.dreamstime.com/b/amazon-logo-white-background-montreal-canada-july-printed-paper-98221126.jpg",
        "https://store-images.s-microsoft.com/image/apps.14475.9007199266245695.9c915e5c-d0d3-411b-90e8-90213b159483.193a1d36-acfb-4f3f-bebd-807ab33293ee",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4dJnTniYbwmtGJ3cyPX-AaLOPGtXWDkvdJA&s",
        "https://cdn3.iconfinder.com/data/icons/social-media-2068/64/_shopping-512.png",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlaOjC1Oqc1FCh_WRawYq5ZGyplhdrtSbgZ2NI5YK7XfvK9B0ZkS0JCbFQ9cc20WwFYcw&usqp=CAU"
      ];
      

  return (
    <div className="bodyy">
        <p className="moving-txt">
                Get a comprehensive analysis of product reviews across multiple platforms
                </p>
      <div className="boxx">
        {linksArray.map((link, i) => (
          <span key={i} style={{ '--i': i + 1 }}>
            <img
              src={link}
              alt={`img-${i + 1}`}
            />
          </span>
        ))}
      </div>
    </div>
  );
};

export default Caurosel;
