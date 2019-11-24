// Make connection
var socket = io.connect('http://localhost:4000');

var senderId = 1;
var receiverId;
// Query DOM
    var userList = document.getElementById('userList'),
        receiverName = document.getElementById('receiver_name'),
        message = document.getElementById('message'),
        chatData = document.getElementById('chat-data'),
        sendBtn = document.getElementById('send-btn');


// user list
var userListArray = [];

socket.on('user-list', function(data){
    userList.innerHTML = "";
    userListArray = data;
    chatOpen(userListArray[0].id);

    data.forEach(element => {
        userList.innerHTML += '<div class="chat_list active_chat" onClick="chatOpen('+element.id+')"><div class="chat_people"><div class="chat_img"><img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"></div><div class="chat_ib"><h5>'+element.name.toUpperCase()+' <span class="chat_date">Dec 25</span></h5><p>Test, which is a new approach to have all solutions astrology under one roof.</p></div></div></div>';
    });
   
});

function chatOpen(id){
    let receiver = userListArray.filter(function (person) { return person.id == id })[0];
    receiverId = id;
    receiverName.textContent = receiver.name.toUpperCase();
    socket.emit('chat-load', {id:id});
}

// Emit events
sendBtn.addEventListener('click', function(){
    socket.emit('send-msg', {
        message: message.value,
        senderId: senderId,
        receiverId: receiverId,
    });
    message.value = "";
});


socket.on('chat-list', function(data){
    chatData.innerHTML= "";
    
    data.forEach(element => {

        if(element.msgSenderId==senderId){
            chatData.innerHTML += '<div class="outgoing_msg"><div class="sent_msg"><p>'+element.message+'</p><span class="time_date"> 11:01 AM    |    June 9</span></div></div>';
        }else{
            chatData.innerHTML += '<div class="incoming_msg"><div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div><div class="received_msg"><div class="received_withd_msg"><p>'+element.message+'</p><span class="time_date"> 11:01 AM    |    June 9</span></div></div></div>';
        }

    });


});