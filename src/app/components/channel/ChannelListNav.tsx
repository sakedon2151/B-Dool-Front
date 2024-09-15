// workspace page component
import { HiHashtag, HiOutlineStar } from "react-icons/hi2";



export default function ChannelListNav() {
    return (
        <div className="">
            <ul className="menu">
                <li className="menu-title flex flex-row justify-between">
                    워크스페이스 채널
                    {/* <button className="btn">+</button> */}
                </li>    

                {/* response list loop */}
                <li>
                    <a>
                        <HiHashtag className="w-4 h-4"/>
                        <p>Channel 1</p>
                        <button>
                            <HiOutlineStar className="w-4 h-4"/>
                        </button>
                    </a>
                </li>
                
                <li>
                    <a>
                        <HiHashtag className="w-4 h-4"/>
                        <p>Channel 1</p>
                        <button>
                            <HiOutlineStar className="w-4 h-4"/>
                        </button>
                    </a>
                </li>
                <li>
                    <a>
                        <HiHashtag className="w-4 h-4"/>
                        <p>Channel 1</p>
                        <button>
                            <HiOutlineStar className="w-4 h-4"/>
                        </button>
                    </a>
                </li>
                <li>
                    <a>
                        <HiHashtag className="w-4 h-4"/>
                        <p>Channel 1</p>
                        <button>
                            <HiOutlineStar className="w-4 h-4"/>
                        </button>
                    </a>
                </li>
                <li>
                    <a>
                        <HiHashtag className="w-4 h-4"/>
                        <p>Channel 1</p>
                        <button>
                            <HiOutlineStar className="w-4 h-4"/>
                        </button>
                    </a>
                </li>
                <li>
                    <a>
                        <HiHashtag className="w-4 h-4"/>
                        <p>Channel 1</p>
                        <button>
                            <HiOutlineStar className="w-4 h-4"/>
                        </button>
                    </a>
                </li>
                <li>
                    <a>
                        <HiHashtag className="w-4 h-4"/>
                        <p className="text-ellipsis overflow-hidden whitespace-nowrap">example channel wow very nice</p>
                        <button>
                            <HiOutlineStar className="w-4 h-4"/>
                        </button>
                    </a>
                </li>
            </ul>
        </div>
    )
}