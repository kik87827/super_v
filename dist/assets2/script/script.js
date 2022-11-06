//
// function setScreenSize() {
//   let vh = window.innerHeight * 0.01;
//   document.documentElement.style.setProperty('--vh', `${vh}px`);
// }
// setScreenSize();
// window.addEventListener('resize', setScreenSize);

// 버튼 클릭시 팝업 화면 띄우기 (임시) 팝업시 스크롤 막기
// 유튜브 팝업
$('.pop').on('click', function () {
  $('.popup-area').addClass('show');
  openPopup();
});

$('.play-area').on('click', function () {
  $('.popup-wrap').addClass('play');
  $('#youtube').attr('src','https://www.youtube-nocookie.com/embed/3kYAuRe4Atw?autoplay=1&mute=0&rel=0&controls=0');
})

// 친구 추가 방법 팝업
$('.how-pop').on('click', function () {
  $('.popup-wrap').addClass('add');
});

//  공유 방법 팝업
$('.how-share').on('click', function () {
  $('.popup-wrap').addClass('share');
});

// 등록하기 버튼 클릭시 팝업
$('.regist').on('click', function () {
  let textArea = $('#requestCt').val();

  // $('.popup-wrap').addClass('signup');
  const height = $(window).height();
  const width = $(window).width();
  if( width <= 1024 ) {
    if (height > width) {
      $('.popup-wrap.signup').addClass('all');
      // $('.popup-area .popup-wrap.signup .close, .content-area').css('display','none');
    } else {
      $('.popup-wrap.signup').removeClass('all')
      // $('.popup-area .popup-wrap.signup .close, .content-area').css('display','block');
    }
  }

  if (textArea.length == 0) {
    alert('V를 선택한 이유를 입력해 주세요.')
    closePopup();
  } else {
    $('.popup-wrap').addClass('signup');
  }
})

// 팝업 닫기
$('.close, .cancle').on('click', function () {
  closePopup();
});

// 라디오버튼 클릭 이벤트
$('.radio-wrap li').on('click', function () {
  $(this).addClass('active').siblings().removeClass('active');
});

// 팝업열기 콘텐츠 스크롤 막기
function openPopup() {
  $('body').css('overflow','hidden');
}

// 팝업닫기 공통함수
function closePopup() {
  $('.popup-wrap').removeClass().addClass('popup-wrap');
  $('.popup-area').removeClass('show');
  $('.popup-area .close, .content-area').css('display', 'block');
  $('.content-area').removeClass('scroll-lock');
  $('#youtube').attr('src', '');
  $('body').css('overflow','auto');
}

// 탭 메뉴 클릭에 따른 화면 전환
function showTabArea(area) {

  if (area == 'event2') {
    alert('11월 7일 Coming Soon');
  }

  // TODO: event2 메뉴 생길 때 주석 해제
  /*const tabBtn = document.querySelectorAll('.event-tab button');
  tabBtn.forEach((el) => {
    const thisBtn = el.getAttribute('data-eventBtn');
    el.classList.remove('active');
    if (area == thisBtn) {
      el.classList.add('active');
    }
  });

  const tabArea = document.querySelectorAll('.tab-area-wrap .tab-area');
  tabArea.forEach((el) => {
    const thisArea = el.getAttribute('data-area');
    el.classList.remove('show');
    if (area == thisArea) {
      el.classList.add('show');
    }
  })*/

}

let totalData; //총 데이터 수
let totalCount;
let dataPerPage; //한 페이지에 나타낼 글 수
let pageCount = 10; //페이징에 나타낼 페이지 수
let globalCurrentPage=1; //현재 페이지

// 리스트 불러오고 페이지 세팅한다.
$(document).ready(function(){
  //dataPerPage 선택값 가져오기
  dataPerPage = 20;

  $.ajax({ // ajax로 데이터 가져오기
    url  : 'https://www.superv.com/clientsvc/study/v1/teaser/list?page=0',
    type : "POST",
    data : JSON.stringify ({
      page		: dataPerPage
    }),
    contentType : "application/json",
    dataType    : "json",
    success: function (result) {
      var html = "";

      html += '<ul>';
      for (var i=0; i<result.data.content.length;i++) {
        var nm = result.data.content[i].requestNm;
        var nm1 = nm.substr(0,1);
        var nm2 = nm.substr(-1);
        var star = '*';
        if (nm.length >= 3) {
          star = '*'.repeat(nm.length-2);
        }

        var no = result.data.content[i].requestPhoneNo;
        var no1 = no.substr(7,1);
        var no2 = no.substr(-1);
        html += '<li>';
        html += '<div class="table-title">';
        html += '<p class="choice">'+result.data.content[i].requestTitle+'</p>';
        if (nm.length == 1) {
          html += '<p class="user">'+nm+'('+no1+'**'+no2+')님</p>';
        } else if (nm.length == 2) {
          html += '<p class="user">'+nm1+star+'('+no1+'**'+no2+')님</p>';
        } else if (nm.length >= 3) {
          html += '<p class="user">'+nm1+star+nm2+'('+no1+'**'+no2+')님</p>';
        }
        html += '</div>';
        html += '<div class="table-content">'+result.data.content[i].requestCt+'</div>';
        html += '</li>';
      }
      html += '</ul>';

      $("#listBody").empty();
      $("#listBody").append(html);
      //총갯수
      totalData = result.data.totalElements;
      //console.log("totalData="+totalData);
      totalData2 = result.data.numberOfElements;
      //console.log("totalData="+totalData2);

      paging(totalData, dataPerPage, pageCount, 1);
    }
  });
});

// 페이징 그리기
function paging(totalData, dataPerPage, pageCount, currentPage) {
  totalPage = Math.ceil(totalData / dataPerPage); //총 페이지 수

  if(totalPage<pageCount){
    pageCount=totalPage;
  }

  let pageGroup = Math.ceil(currentPage / pageCount); // 페이지 그룹
  let last = pageGroup * pageCount; //화면에 보여질 마지막 페이지 번호

  if (last > totalPage) {
    last = totalPage;
  }

  let first = last - (pageCount - 1); //화면에 보여질 첫번째 페이지 번호
  let next = last + 1;
  let prev = first - 1;

  let pageHtml = "";

  pageHtml += "<button><a href='#none' id='prev' class='arrow prev' style='display:flex;'></a></button>";
  pageHtml += "<p><span>" + currentPage + "</span>" + " / " + totalPage + "</p>";
  pageHtml += "<button><a href='#none' id='next' class='arrow next' style='display:flex;'></a></button>";

  $("#pagingul").html(pageHtml);
  let displayCount = "";
  displayCount = "현재 1 - " + totalPage + " 페이지 / " + totalData + "건";
  $("#displayCount").text(displayCount);


  //페이징 번호 클릭 이벤트
  $("#pagingul .arrow").click(function () {
    let $id = $(this).attr("id");
    selectedPage = currentPage;

    if ($id == "next") selectedPage = selectedPage + 1;
    if ($id == "prev") selectedPage = selectedPage - 1;

    //전역변수에 선택한 페이지 번호를 담는다...
    globalCurrentPage = selectedPage;

    if (selectedPage < 1 || selectedPage > totalPage) {
      return;
    }

    //글 목록 표시 재호출
    displayData(selectedPage);
    //페이징 표시 재호출
    paging(totalData, dataPerPage, pageCount, selectedPage);
  });
}

// 이름체크
// PC
function typedName() {
  const regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;
  const numPattern = /[0-9]/g;

  if (regExp.test($('.requestNm').val())) {
    alert('한글 또는 영문만 입력해 주세요.');
    $('.requestNm').val($('.requestNm').val().replace(regExp,''));
  }

  if (numPattern.test($('.requestNm').val())) {
    alert('한글 또는 영문만 입력해 주세요.');
    $('.requestNm').val($('.requestNm').val().replace(numPattern,''));
  }

  if ($('.requestNm').val().length > 6) {
    alert('이름은 최대 6글자로 입력해 주세요.')
    $('.requestNm').val($('.requestNm').val().slice(0, -1));
  }
}
// Mobile
function typedNameMo() {
  const regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;
  const numPattern = /[0-9]/g;

  if (regExp.test($('.requestNmMo').val())) {
    alert('한글 또는 영문만 입력해 주세요.');
    $('.requestNmMo').val($('.requestNmMo').val().replace(regExp,''));
  }

  if (numPattern.test($('.requestNmMo').val())) {
    alert('한글 또는 영문만 입력해 주세요.');
    $('.requestNmMo').val($('.requestNmMo').val().replace(numPattern,''));
  }

  if ($('.requestNmMo').val().length > 6) {
    alert('이름은 최대 6글자로 입력해 주세요.');
    $('.requestNmMo').val($('.requestNmMo').val().slice(0, -1));
  }
}

// 번호체크
// PC
function typedPhoneNum() {
  const numPattern = /^[0-9]+$/;

  if (!numPattern.test($('.requestPhoneNo').val())) {
    alert('숫자만 입력해 주세요.');
    $('.requestPhoneNo').val($('.requestPhoneNo').val().replace(/[^0-9]/g,''));
  }
}
// Mobile
function typedPhoneNumMo() {
  const numPattern = /^[0-9]+$/;

  if (!numPattern.test($('.requestPhoneNoMo').val())) {
    alert('숫자만 입력해 주세요.');
    $('.requestPhoneNoMo').val($('.requestPhoneNoMo').val().replace(/[^0-9]/g,''));
  }
}

// 동의하기 각각 클릭
function clickEachAgree(device) {
  if (device == 'P') {
    const inputAllAgree = document.querySelector('.p-allAgree');
    const inputAgree = document.querySelectorAll('.p-agree');

    inputAgree.forEach((el) => {
      if (checkAgreePCCount() == 1) {
        inputAllAgree.checked = false;
      } else {
        if (checkAgreePCCount() == 2) {
          inputAllAgree.checked = true;
        } else if (checkAgreePCCount() == 0) {
          inputAllAgree.checked = false;
        }
      }
    });
  } else if (device == 'M') {
    const inputAllAgree = document.querySelector('.m-allAgree');
    const inputAgree = document.querySelectorAll('.m-agree');

    inputAgree.forEach((el) => {
      if (checkAgreeMoCount() == 1) {
        inputAllAgree.checked = false;
      } else {
        if (checkAgreeMoCount() == 2) {
          inputAllAgree.checked = true;
        } else if (checkAgreeMoCount() == 0) {
          inputAllAgree.checked = false;
        }
      }
    });
  }
}

// 모두 동의하기 체크
function clickAllAgree(device) {
  let inputAllAgree = '';
  let inputAgree = '';

  if (device == 'P') {
    inputAllAgree = document.querySelector('.p-allAgree');
    inputAgree = document.querySelectorAll('.p-agree');
  } else if (device == 'M') {
    inputAllAgree = document.querySelector('.m-allAgree');
    inputAgree = document.querySelectorAll('.m-agree');
  }

  if (inputAllAgree.checked) {
    inputAgree.forEach((el) => {
      el.checked = true;
    });
  } else {
    inputAgree.forEach((el) => {
      el.checked = false;
    });
  }
}

// 필수동의 카운트
// PC
function checkAgreePCCount() {
  const inputAgree = document.querySelectorAll('.p-agree');
  let count = 0;
  inputAgree.forEach((el) => {
    if (el.checked == true) {
      count++;
    }
  });
  return count;
}
// Mobile
function checkAgreeMoCount() {
  const inputAgree = document.querySelectorAll('.m-agree');
  let count = 0;
  inputAgree.forEach((el) => {
    if (el.checked == true) {
      count++;
    }
  });
  return count;
}

// 공유하기
function sharePage() {
  let url = '';    // <a>태그에서 호출한 함수인 clip 생성
  let textarea = document.createElement("textarea");
  //url 변수 생성 후, textarea라는 변수에 textarea의 요소를 생성

  document.body.appendChild(textarea); //</body> 바로 위에 textarea를 추가(임시 공간이라 위치는 상관 없음)
  url = window.document.location.href;  //url에는 현재 주소값을 넣어줌
  textarea.value = url;  // textarea 값에 url를 넣어줌
  textarea.select();  //textarea를 설정
  document.execCommand("copy");   // 복사
  document.body.removeChild(textarea); //extarea 요소를 없애줌

  alert("URL이 복사되었습니다.")  // 알림창
}

// 페이지별 리스트 호출
function displayData(currentPage) {
//console.log("currentPage="+currentPage);
  var currentPage2 = Number(currentPage) - 1;
//console.log("currentPage2="+currentPage2);
  $.ajax({
    url  : 'https://www.superv.com/clientsvc/study/v1/teaser/list?page='+currentPage2,
    type : "POST",
    data : JSON.stringify ({
      page		: currentPage
    }),
    contentType : "application/json",
    dataType    : "json",
    success: function(result){
      var html = "";

      html += '<ul>';
      for (var i=0; i<result.data.content.length;i++) {
        var nm = result.data.content[i].requestNm;
        var nm1 = nm.substr(0,1);
        var nm2 = nm.substr(-1);
        var star = '';
        if (nm.length >= 3) {
          star = '*'.repeat(nm.length-2);
        }

        var no = result.data.content[i].requestPhoneNo;
        var no1 = no.substr(7,1);
        var no2 = no.substr(-1);
        html += '<li>';
        html += '<div class="table-title">';
        html += '<p class="choice">'+result.data.content[i].requestTitle+'</p>';
        if (nm.length == 1) {
          html += '<p class="user">'+nm+'('+no1+'**'+no2+')님</p>';
        } else if (nm.length == 2) {
          html += '<p class="user">'+nm1+star+'('+no1+'**'+no2+')님</p>';
        } else if (nm.length >= 3) {
          html += '<p class="user">'+nm1+star+nm2+'('+no1+'**'+no2+')님</p>';
        }
        html += '</div>';
        html += '<div class="table-content">'+result.data.content[i].requestCt+'</div>';
        html += '</li>';
      }
      html += '</ul>';

      $("#listBody").empty();
      $("#listBody").append(html);
    }
  });
}

// 모바일 기기 체크
function isMobile(){
  var UserAgent = navigator.userAgent;

  if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) {
    return true;
  } else {
    return false;
  }
}

// 중복체크
function fnCmdWritePre() {
  const eventItem = document.querySelectorAll('.eventDivWrap li');
  let thisEventDiv = '';
  eventItem.forEach((el) => {
    if (el.classList.contains('active')) {
      thisEventDiv = el.getAttribute('data-value');
    }
  });

  let checkedAge = '';
  let requestNm = '';
  let phoneNum = '';
  let deviceMode = '';

  if (isMobile()) {
    deviceMode = 'M';
    checkedAge = $('input[name=childAgeMo]:checked').attr('value');
    requestNm = $(".requestNmMo").val();
    phoneNum = $('.requestPhoneNoMo').val();

    if (!$(".requestNmMo").val()) {
      alert('이름을 입력해 주세요.');
      return;
    }
    if (!$(".requestPhoneNoMo").val()) {
      alert('핸드폰 번호를 입력해 주세요.');
      return;
    }
    if ($(".requestPhoneNoMo").val().length < 10 || $(".requestPhoneNoMo").val().length > 11) {
      alert('휴대폰 번호의 길이를 확인해 주세요.');
      return;
    }
  } else {
    deviceMode = 'P';
    checkedAge = $('input[name=childAge]:checked').attr('value');
    requestNm = $(".requestNm").val();
    phoneNum = $('.requestPhoneNo').val();

    if (!$(".requestNm").val()) {
      alert('이름을 입력해 주세요.');
      return;
    }
    if (!$(".requestPhoneNo").val()) {
      alert('핸드폰 번호를 입력해 주세요.');
      return;
    }
    if ($(".requestPhoneNo").val().length < 10 || $(".requestPhoneNo").val().length > 11) {
      alert('휴대폰 번호의 길이를 확인해 주세요.');
      return;
    }
  }

  if (!checkedAge) {
    alert('자녀 나이를 선택해 주세요.');
    return;
  }

  // 동의 유효성
  if (deviceMode == 'M') {
    // Mobile
    if (document.querySelector('.m-agreeA').checked == false) {
      alert('개인 정보 수집 및 이용에 동의해주세요.');
      return;
    } else if (document.querySelector('.m-agreeB').checked == false) {
      alert('개인 정보 위탁 제공에 동의해주세요.');
      return;
    }
  } else if (deviceMode = 'P') {
    // PC
    if (document.querySelector('.p-agreeA').checked == false) {
      alert('개인 정보 수집 및 이용에 동의해주세요.');
      return;
    } else if (document.querySelector('.p-agreeB').checked == false) {
      alert('개인 정보 위탁 제공에 동의해주세요.');
      return;
    }
  }

  $.ajax({
    url  : 'https://www.superv.com/clientsvc/study/v1/teaser/joinPre',
    type : "POST",
    data : JSON.stringify ({
      broswerDiv			: deviceMode,
      eventDiv			: 'B',
      requestNm			: requestNm,
      requestPhoneNo		: phoneNum
    }),
    contentType : "application/json",
    dataType    : "json",
    success: function(msg){
      if (msg.data.result == "Y") // 참여가능
      {
        fnCmdWrite();
      } else {
        alert('이미 이벤트 등록이 완료된 정보입니다.');

        $(".requestNm").val('');
        $(".requestNmMo").val('');
        $(".requestPhoneNo").val('');
        $(".requestPhoneNoMo").val('');

        $('input[name=childAge]').removeAttr('checked');
        $('input[name=childAgeMo]').removeAttr('checked');
        $('.m-agreeA').removeAttr('checked');
        $('.m-agreeB').removeAttr('checked');
        $('.p-agreeA').removeAttr('checked');
        $('.p-agreeB').removeAttr('checked');
        $('.m-allAgree').removeAttr('checked');
        $('.p-allAgree').removeAttr('checked');

        closePopup();

        $("#requestCt").val('');
      }
    },
    error: function(request, status, error) {
      alert(`code=${request.status}, message=${request.responseText}, error=${error}`)
    }
  });
}

// 글등록
function fnCmdWrite() {
  const eventItem = document.querySelectorAll('.eventDivWrap li');
  let thisEventDiv = '';
  eventItem.forEach((el) => {
    if (el.classList.contains('active')) {
      thisEventDiv = el.getAttribute('data-value');
    }
  });
  let checkedAge = '';
  let requestNm = '';
  let phoneNum = '';
  let deviceMode = '';

  if (isMobile()) {
    deviceMode = 'M';
    checkedAge = $('input[name=childAgeMo]:checked').attr('value');
    requestNm = $(".requestNmMo").val();
    phoneNum = $('.requestPhoneNoMo').val();

    if (!$(".requestNmMo").val()) {
      alert('이름을 입력해 주세요.');
      return;
    }
    if (!$(".requestPhoneNoMo").val()) {
      alert('핸드폰 번호를 입력해 주세요.');
      return;
    }
    if ($(".requestPhoneNoMo").val().length < 10 || $(".requestPhoneNoMo").val().length > 11) {
      alert('휴대폰 번호의 길이를 확인해 주세요.');
      return;
    }
  } else {
    deviceMode = 'P';
    checkedAge = $('input[name=childAge]:checked').attr('value');
    requestNm = $(".requestNm").val();
    phoneNum = $('.requestPhoneNo').val();

    if (!$(".requestNm").val()) {
      alert('이름을 입력해 주세요.');
      return;
    }
    if (!$(".requestPhoneNo").val()) {
      alert('핸드폰 번호를 입력해 주세요.');
      return;
    }
    if ($(".requestPhoneNo").val().length < 10 || $(".requestPhoneNo").val().length > 11) {
      alert('휴대폰 번호의 길이를 확인해 주세요.');
      return;
    }
  }

  if (!checkedAge) {
    alert('자녀 나이를 선택해 주세요.');
    return;
  }

  // 동의 유효성
  if (deviceMode == 'M') {
    // Mobile
    if (document.querySelector('.m-agreeA').checked == false) {
      alert('개인 정보 수집 및 이용에 동의해주세요.');
      return;
    } else if (document.querySelector('.m-agreeB').checked == false) {
      alert('개인 정보 위탁 제공에 동의해주세요.');
      return;
    }
  } else if (deviceMode = 'P') {
    // PC
    if (document.querySelector('.p-agreeA').checked == false) {
      alert('개인 정보 수집 및 이용에 동의해주세요.');
      return;
    } else if (document.querySelector('.p-agreeB').checked == false) {
      alert('개인 정보 위탁 제공에 동의해주세요.');
      return;
    }
  }

  $.ajax({
    url  : 'https://www.superv.com/clientsvc/study/v1/teaser/join',
    type : "POST",
    data : JSON.stringify ({
      broswerDiv			: deviceMode,
      eventDiv			: 'B',
      requestTitle		: thisEventDiv,
      requestCt			: $("#requestCt").val(),
      requestNm			: requestNm,
      requestPhoneNo		: phoneNum,
      childAge: checkedAge,
    }),
    contentType : "application/json",
    dataType    : "json",
    success: function(msg){
      alert('이벤트 등록이 완료되었습니다.');

      $(".requestNm").val('');
      $(".requestNmMo").val('');
      $(".requestPhoneNo").val('');
      $(".requestPhoneNoMo").val('');

      $('input[name=childAge]').removeAttr('checked');
      $('input[name=childAgeMo]').removeAttr('checked');
      $('.m-agreeA').removeAttr('checked');
      $('.m-agreeB').removeAttr('checked');
      $('.p-agreeA').removeAttr('checked');
      $('.p-agreeB').removeAttr('checked');
      $('.m-allAgree').removeAttr('checked');
      $('.p-allAgree').removeAttr('checked');

      closePopup();

      $("#requestCt").val('');

      displayData('1');
    }
  });
}
