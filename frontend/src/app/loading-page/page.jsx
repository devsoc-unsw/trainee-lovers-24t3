import React from 'react';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import useAuthStore from '@/store/useAuthStore';

const Page = () => {
    const {  } = useAuthStore();
    return (
        <LoadingPage isVisible={true}/>
    );
};

export default Page;