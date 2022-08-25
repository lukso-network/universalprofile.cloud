import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div className="mx-6">
      <h2 className="text-5xl font-normal leading-normal mt-0 mb-2">
        Overview page
      </h2>
      <ul>
        <li>
          <Link href="/0xA8285FE8877F25dD0A9c8a7f03c0cbA5C88dF57A/overview">
            <a>0xA8285FE8877F25dD0A9c8a7f03c0cbA5C88dF57A</a>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
