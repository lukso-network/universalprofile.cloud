import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiPlus } from 'react-icons/fi';
import { AiOutlineEye } from 'react-icons/ai';

const SideBar: React.FC = () => {
  const router = useRouter();

  return (
    <div
      className="fixed bg-lighterBlack left-0 top-0 bottom-0
      w-[240px] flex flex-col px-4"
    >
      <div className="flex flex-col items-center my-8 text-center">
        <div className="text-white font-bold ">{`Welcome to Lukso's Wallet`}</div>
        <div className="text-gray-300 my-6 leading-5 text-sm">
          Connect to the UP extension to manage your portfolio
        </div>
        <button className="flex items-center rounded-lg bg-deepPink py-1 px-4">
          <div className="text-2xl">
            <FiPlus className="text-white" />
          </div>
          <span className="mx-2 text-white text-sm">Connect</span>
        </button>
      </div>
      <div className="border-t border-solid border-1 border-gray-800 py-3">
        <div className="text-sm flex flex-col">
          <Link href="/overview">
            <div
              className={`flex text-gray-300 items-center mb-10 py-3
                        px-2 rounded-lg hover:bg-gray-700 text-sm cursor-pointer
                        ${
                          router.pathname.includes('overview')
                            ? 'text-lightPink'
                            : ''
                        }
                      `}
            >
              <AiOutlineEye className="text-2xl mr-3" />
              <div>Overview</div>
            </div>
          </Link>
          {/* TODO: Add Vaults, Send Links when logged in*/}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
