import ImgMediaCard from "./card";
export default function AvilableLots() {
    return (
      <>
       <div className="  " >
        <div className="head m-[5vh]"> 
            Popular Parking Lots
        </div >
       <div className="flex flex-wrap justify-center">
       <ImgMediaCard title="Title" description="Description" image="https://plus.unsplash.com/premium_photo-1661956487605-1544bcd9b29e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2FyJTIwaW4lMjBwYXJraW5nfGVufDB8fDB8fHww"/>
       <ImgMediaCard title="Title" description="Description" image="https://plus.unsplash.com/premium_photo-1661902297268-10b52852e862?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y2FyJTIwaW4lMjBwYXJraW5nfGVufDB8fDB8fHww"/>
       <ImgMediaCard title="Title" description="Description" image="https://images.unsplash.com/photo-1445548671936-e1ff8a6a6b20?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"/>
       <ImgMediaCard title="Title" description="Description" image="https://images.unsplash.com/photo-1518050084750-43b2240820d3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGNhciUyMGluJTIwcGFya2luZ3xlbnwwfHwwfHx8MA%3D%3D"/>
       </div>
       </div>
       <style jsx>{`
        .head {
          color: #030303;
          font-size: 40px;
          font-weight: 700;
          font-family: Poppins;
          font-variant: no-common-ligatures;
          font-kerning: auto;
          font-optical-sizing: auto;
          font-stretch: 100%;
          font-variation-settings: normal;
          font-feature-settings: normal;
          text-transform: none;
          text-decoration: none solid rgb(3, 3, 3);
          text-align: left;
          text-indent: 0px;
        }
      `}</style>
      </>
    );
  }
  