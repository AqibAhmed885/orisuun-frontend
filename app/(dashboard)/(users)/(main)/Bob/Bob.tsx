
import BobProfile from "./components/BobProfile";

export interface PageProps {
  params: { id?: string; username?: string };
  searchParams?: { userProfileTypeId: string };
}

const Bob = ({ params, searchParams}) => {


    return (
        <>
           <BobProfile  params={params} searchParams={searchParams}  /> 
        </>
    );
};

export default Bob;
