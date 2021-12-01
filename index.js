let socket = io();
let input = document.getElementById('input');

//calculate date time
function getDateTime(){
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    let time = today.getHours() + ":" + today.getMinutes() ;
    return today = time +' '+ mm + '/' + dd + '/' + yyyy;
}
//end of calculate date time

//random avatar
let arrSrc = ['ava1.jpg','ava4.gif','ava6.gif','ava9.png'];
let arrSrcReturn = arrSrc[Math.floor(Math.random() * 4)];
//end of random avatar

$('#form-chat').on('submit', function (e){
    e.preventDefault();
    let user = localStorage.getItem('username');
    let data = [input.value, user];
    console.log(data);
    if (input.value){
        //truyen emit len voi data gom co msg, user name trong Data
        socket.emit('chat-msg', data);
        input.value = '';
    }
});
socket.on('chat-msg', function (data){
    //data gom [username] va [msg]
    let username = data[1];
    if (localStorage.getItem('username') != username){
        $('#messages').append('<div class="container ">' +
            '<span><b>'+ username +'</b> <a class="online"></a> </span>'+
            '        <img src="http://localhost:63342/test-socket-demo/radomAvatar/'+ arrSrcReturn +'"  class="right" alt="Avatar"  style="width:100%;">' +
            '        <p>'+ data[0] +'</p>' +
            '        <span class="time-left">'+ '<i>' + getDateTime() + '</i>' +'</span>' +
            '    </div>');
        soundAlert();
        $('#guideMsgIndex').text('')
        window.scrollTo(0, document.body.scrollHeight);
    } else {
        $('#messages').append('<div class="container darker">' +
            '<span> <b>'+ username +'</b>  </span>'+
            '        <img src="http://localhost:63342/test-socket-demo/radomAvatar/'+ arrSrcReturn +'" alt="Avatar"  style="width:100%;">' +
            '        <p>'+ data[0] +'</p>' +
            '        <span class="time-right">'+ '<i>' + getDateTime() + '</i>' +'</span>' +
            '    </div>');
        soundAlert();
        $('#guideMsgIndex').text('')
        window.scrollTo(0, document.body.scrollHeight);
    }
})

//login
if (!localStorage.getItem('username')){
    let username = prompt('Nhập tên của bạn!','Nam');
    localStorage.setItem('username', username);
    appendAlert('Bạn đã tham gia phòng chat!');

    socket.emit('user-login', username);
    soundOnline();
}

//logout
$('#logout').click(function (){
    localStorage.removeItem('username');
    alert('Bạn đã đăng xuất!');
    window.location.reload();
});

// append message
socket.on('new-user-connected', name =>{
    appendAlert(name + ' đã tham gia phòng chat!');
    soundOnline();
})

socket.on('user-disconnected', name =>{
    appendAlertDisconnect(name + ' đã ngắt kết nối!');
    soundLogout();
})

function appendAlert(message){
    $('#messages').append('<div class="alert-msg"><i class="fas fa-user"></i> '+ message +'</div>');
}
function appendAlertDisconnect(message){
    $('#messages').append('<div class="alert-msg-red"><i class="fas fa-user"></i> '+ message +'</div>');
}

//check someone is typing
function checkTyping(){
    let input = document.getElementById('input');
    let user = localStorage.getItem('username');
    if (input.value.length > 0){
        socket.emit('check-typing', user);
    }
    else {
        socket.emit('non-typing');
    }

}
socket.on('user-typing', user =>{
    // $('#messages').append(user + ' is typing');
    $('#guideMsgIndex').text(user + ' đang viết ...')
});

socket.on('non-user-typing', ()=>{
    $('#guideMsgIndex').text('')
})
//end of check someone is typing

//sound zone
function soundAlert(){
    let soundAlert = $('#msg-receive-sound')[0];
    soundAlert.play();
}
function soundOnline(){
    let soundAlert = $('#msg-receive-online')[0];
    soundAlert.play();
}

function soundLogout(){
    let soundAlert = $('#msg-receive-disconnected')[0];
    soundAlert.play();
}