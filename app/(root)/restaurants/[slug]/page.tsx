import Carousel from "@/components/featured/carousel";

export default function Restaurant() {
  const carouselItems = [
    {
      id: 1,
      image: "https://picsum.photos/601/1201",
      title: "Explore Amazing Destinations",
    },
    {
      id: 2,
      image: "https://picsum.photos/604/1203",
      title: "Discover New Adventures",
    },
    {
      id: 3,
      image: "https://picsum.photos/606/1203",
      title: "Experience Luxury Travel",
    },
    {
      id: 4,
      image: "https://picsum.photos/607/1202",
      title: "Unforgettable Journeys",
    },
    {
      id: 5,
      image: "https://picsum.photos/602/1208",
      title: "Create Lasting Memories",
    },
  ];

  return (
    <>
      <section className="section">
        <h1>Restaurant name</h1>
        <h5>Some restaurant description</h5>
      </section>
      <section className="section pb-2 lg:pb-4">
        <h3>Chef Picks</h3>
      </section>
      <Carousel items={carouselItems} />
    </>
  );
}
