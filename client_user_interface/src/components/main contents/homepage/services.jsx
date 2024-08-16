import ImgMediaCard from "./card";
export default function Services() {
    return (
      <>
       <div className="  " >
        <div className="headf m-[5vh]"> 
            Benefits of using our Services
        </div >
       <div className="flex flex-wrap justify-center">
       <ImgMediaCard title="Fast Tag Billing" description="Direct fast tag billing without maual intervention" image="https://bolsterfizz.com/wp-content/uploads/2020/01/images.jpg"/>
       <ImgMediaCard title="Online Booking" description="Pre book parking lots online with convineince" image="https://images.unsplash.com/photo-1484807352052-23338990c6c6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"/>
       <ImgMediaCard title="Add money online" description="No hassle of paying money in cash money will be deducted automatically " image="https://plus.unsplash.com/premium_photo-1667520253678-b2d0eb4b9690?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"/>
       <ImgMediaCard title="Cheapest Parking" description="It is the cheapest parking lot service as the rates are hourley calculated" image="https://plus.unsplash.com/premium_photo-1682986671851-eba6a14e77af?q=80&w=2058&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"/>
       </div>
       </div>
       <style jsx>{`
        .headf {
          color: #030303;
          font-size: 32px;
          font-weight: 500;
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
  