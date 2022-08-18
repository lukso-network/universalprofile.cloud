import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Overview: NextPage = () => {
  useEffect(() => {
    router.push('/overview');
  }, []);

  const router = useRouter();

  return (
    <>
      <div>Overview page</div>
    </>
  );
};

export default Overview;
