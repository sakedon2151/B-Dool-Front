import { HiHashtag, HiOutlineStar, HiOutlineUser } from "react-icons/hi2";

export default function ChannelListNav() {
  return (
    <ul className="menu">

      {/* favorite */}
      <li>
        <details open>
          <summary className="font-bold ">즐겨찾기</summary>
          <ul>
            <li>
              <a>
                <HiHashtag className="w-4 h-4" />
                <p>Channel 1</p>
                <button>
                  <HiOutlineStar className="w-4 h-4" />
                </button>
              </a>
            </li>
          </ul>
        </details>
      </li>

      {/* workspace */}
      <li>
        <details open>
          <summary className="font-bold ">워크스페이스 채널</summary>
          <ul>
            <li>
              <a>
                <HiHashtag className="w-4 h-4" />
                <p className="overflow-hidden whitespace-nowrap truncate">general channel</p>
                <button>
                  <HiOutlineStar className="w-4 h-4" />
                </button>
              </a>
            </li>
          </ul>
        </details>
      </li>

      {/* direct message */}
      <li>
        <details>
          <summary className="font-bold">다이렉트 메시지</summary>
          <ul>
            <li>
              <a>
                <HiOutlineUser className="w-4 h-4" />
                <p>username</p>
                <button>
                  <HiOutlineStar className="w-4 h-4" />
                </button>
              </a>
            </li>
          </ul>
        </details>
      </li>

    </ul>
  );
}
