import demo from '/assets/videos/demo.webm'
const ProductDemo: React.FC = () => {
  return (
    <section className="bg-white py-12 -mt-20 relative z-10">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-gray-800 bg-gray-900">
             <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="w-full h-auto"
            >
              <source src={demo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDemo;