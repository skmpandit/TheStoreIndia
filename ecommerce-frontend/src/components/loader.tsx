import { useEffect, useState } from 'react';
import { Circles } from 'react-loader-spinner'

const Loader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Example: Set loading to false after 3 seconds (Replace this with your actual loading logic)

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className={`Loader ${loading ? 'show' : 'hide'}`}>
      <div className="Loader">
        <Circles
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
        />
      </div>
    </div>
  )
}

export default Loader

interface SkeletonProps {
  width? : string,
  length? : number,
}

export const Skeleton = ({ width = "unset", length = 3 } : SkeletonProps) => {
  const skeletions = Array.from({ length }, (_,idx) => (
    <div key={idx} className="skeleton-shape"></div>
  ))
  return (
    <div className="skeleton-loader" style={{ width }}>
      {skeletions}
    </div>
  )
}
