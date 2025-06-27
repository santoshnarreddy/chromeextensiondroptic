import React, { useState } from 'react';

const ImageSlider = () => {
  const images = ['/image.jpg', '/image.jpg', '/image.jpg'];
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((idx + images.length - 1) % images.length);
  const next = () => setIdx((idx + 1) % images.length);
  return (
    <div style={{position:'relative', marginBottom:16}}>
      <img src={images[idx]} alt="slider" className="top-image" />
      <button
        style={{
          position: 'absolute',
          left: -18,
          top: '50%',
          transform: 'translateY(-50%)',
          background: '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: 36,
          height: 36,
          fontSize: 20,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          zIndex: 2
        }}
        onClick={prev}
        aria-label="Previous"
      >&#8592;</button>
      <button
        style={{
          position: 'absolute',
          right: -18,
          top: '50%',
          transform: 'translateY(-50%)',
          background: '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: 36,
          height: 36,
          fontSize: 20,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          zIndex: 2
        }}
        onClick={next}
        aria-label="Next"
      >&#8594;</button>
      <div style={{textAlign:'center',marginTop:4}}>
        {images.map((_,i)=>(<span key={i} style={{
          display:'inline-block',
          width:8,
          height:8,
          borderRadius:'50%',
          background:i===idx?'#4CAF50':'#ccc',
          margin:'0 2px'
        }}></span>))}
      </div>
    </div>
  );
};

export default ImageSlider; 