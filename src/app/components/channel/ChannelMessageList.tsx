// chat history component

// chat-start: other participant message
// chat-end: my message

// 채널 id 를 토대로 message list 요청
// 해당 list 에서 작성자 분류 및 map 함수 호출로 출력

// review 1 - 컴포넌트가 로드되었을 때 스크롤은 최하단에 있어야 함
// review 2 - 내가 작성한 메시지의 경우, 프로필 이미지가 필요없을 수 있음
// review 3 - 날짜별로 divider 가 출력되어야 함
// review 4 - width 감소시 다른 컴포넌트 레이아웃에 영향 발생함

export default function ChannelMessageList() {
    return (
        <div className="p-2">
            
            <div className="divider px-8 text-xs opacity-50">2024.09.15</div>

            <div className="chat chat-start">
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img alt="profile_img" src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/eed560189998237.65b50b647abf4.png"/>
                    </div>
                </div>
                <div className="chat-header">
                    username
                    <time className="text-xs opacity-50 pl-1">12:30</time>
                </div>
                <div className="chat-bubble">메시지 본문 입니다.</div>
                <div className="chat-footer">(현재 채널 참가자 중 해당 메시지 미 확인 수)</div>
            </div>

            <div className="chat chat-end">
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img alt="profile_img" src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/eed560189998237.65b50b647abf4.png"/>
                    </div>
                </div>
                <div className="chat-header">
                    username
                    <time className="text-xs opacity-50 pl-1">12:30</time>
                </div>
                <div className="chat-bubble">내 메시지 입니다.</div>
                <div className="chat-footer">3</div>
            </div>

            <div className="chat chat-end ">
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img alt="profile_img" src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/eed560189998237.65b50b647abf4.png"/>
                    </div>
                </div>
                <div className="chat-header">
                    username
                    <time className="text-xs opacity-50">12:30</time>
                </div>
                <div className="chat-bubble">이것은 줄바꿈이 있는<br/>글자 입니다.</div>
                <div className="chat-footer">3</div>
            </div>

            <div className="chat chat-end">
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img alt="profile_img" src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/eed560189998237.65b50b647abf4.png"/>
                    </div>
                </div>
                <div className="chat-header">
                    username
                    <time className="text-xs opacity-50">12:30</time>
                </div>
                <div className="chat-bubble">이것은 그냥 긴 글자입니다 이것은 그냥 긴 글자입니다.</div>
                <div className="chat-footer">3</div>
            </div>

            <div className="chat chat-end">
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img alt="profile_img" src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/eed560189998237.65b50b647abf4.png"/>
                    </div>
                </div>
                <div className="chat-header">
                    username
                    <time className="text-xs opacity-50">12:30</time>
                </div>
                <div className="chat-bubble">100문자메시지입니다100문자메시지입니다100문자메시지입니다100문자메시지입니다100문자메시지입니다100문자메시지입니다100문자메시지입니다100문자메시지입니다100문자메시지입니다1</div>
                <div className="chat-footer">3</div>
            </div>

            <div className="chat chat-end">
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img alt="profile_img" src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/eed560189998237.65b50b647abf4.png"/>
                    </div>
                </div>
                <div className="chat-header">
                    username
                    <time className="text-xs opacity-50 pl-1">12:30</time>
                </div>
                <div className="chat-bubble">내 메시지 입니다.</div>
                <div className="chat-footer">3</div>
            </div>
            
            <div className="chat chat-end">
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img alt="profile_img" src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/eed560189998237.65b50b647abf4.png"/>
                    </div>
                </div>
                <div className="chat-header">
                    username
                    <time className="text-xs opacity-50 pl-1">12:30</time>
                </div>
                <div className="chat-bubble">내 메시지 입니다.</div>
                <div className="chat-footer">3</div>
            </div>

            <div className="chat chat-end">
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img alt="profile_img" src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/eed560189998237.65b50b647abf4.png"/>
                    </div>
                </div>
                <div className="chat-header">
                    username
                    <time className="text-xs opacity-50 pl-1">12:30</time>
                </div>
                <div className="chat-bubble">내 메시지 입니다.</div>
                <div className="chat-footer">3</div>
            </div>

            <div className="chat chat-end">
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img alt="profile_img" src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/eed560189998237.65b50b647abf4.png"/>
                    </div>
                </div>
                <div className="chat-header">
                    username
                    <time className="text-xs opacity-50 pl-1">12:30</time>
                </div>
                <div className="chat-bubble">내 메시지 입니다.</div>
                <div className="chat-footer">3</div>
            </div>

        </div>
    )
}