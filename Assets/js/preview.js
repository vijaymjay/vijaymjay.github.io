var queuniqueId = '';
function generatePreview() {
  let passSetId = { questionsetid: uniqueKey };
  console.info(passSetId);
  $.ajax({
    type: "post",
    url: serverKey + "preview/",
    async: false,
    data: JSON.stringify(passSetId),
    contentType: "application/json; charset=utf-8",
    success: function (html) {
      let data = html?.data;
      // console.info(data);
      // mapquestion
      let questionSetId = data.questionsetid;
      let questionTypeId = data.questiontypeid;
      let questionId = data._id;
      let questionName = data.questionname;
      let questionChoice = data.choice;
      let questionUniqueId = data.unique;
      let questionImage = data.qnDescImage;
      queuniqueId = (data.unique) ? data.unique : '';
      let questionOrderId = data.orderid;
      let questionMap = (data.mapquestion) ? data.mapquestion : '';
      createPreviewForm('', questionSetId, questionTypeId, questionId, questionName, questionUniqueId, questionChoice, '', questionImage, questionOrderId, questionMap);
    }
  });
}

function assesmentComplete() {
  let questionSetId = uniqueKey;
  console.log(questionSetId);
  let uniqueIdgen = queuniqueId;
  let completeText = ` <div class="toast success shadow fade show" role="alert" aria-live="assertive" aria-atomic="true">
  <div class=" d-flex align-items-center justify-content-center p-3 gap-3 ">
  <strong class="me-auto success-color fs-5">Assesment Completed</strong>
  <i class="bi bi-check-lg success-color"></i>
  </div>
  </div>`;
  $('#previewDiv').html(completeText);
  setTimeout(function () {
    // location.reload()
    window.location = './summary.html?id=' + questionSetId + '&unique=' + uniqueIdgen;
  }, 1500);

}
function generateNextPreview(formData, validatError, switchType, rowNumber) {
  // console.info({ formData });
  // console.log({validatError})
  if (!validatError) {
    $.ajax({
      type: "post",
      url: serverKey + "preview/",
      async: false,
      data: JSON.stringify(formData),
      contentType: "application/json; charset=utf-8",
      success: function (html) {
        let data;
        let rowNo;
        if (switchType == 'next') {
          choicePrevBno = 0;
          choiceSinglePrevBno = 0;
          data = html?.data;
          rowNo = '';
          if (Array.isArray(data)) {
            data = data[0];
          }
        }
        else {
          choicePrevBno = 0;
          choiceSinglePrevBno = 0;
          data = html?.data[0];
          rowNo = rowNumber;
        }
        console.info({ data });
        if (data) {
          let questionSetId = data.questionsetid;
          let questionTypeId = data.questiontypeid;
          let questionId = data._id;
          let questionName = data.questionname;
          let questionChoice = data.choice;
          let questionUniqueId = data.unique;
          let questionAnswer = data.answer;
          let questionImage = data.qnDescImage;
          let questionOrderId = data.orderid;
          let questionMap = (data.mapquestion) ? data.mapquestion : '';
          createPreviewForm(rowNo, questionSetId, questionTypeId, questionId, questionName, questionUniqueId, questionChoice, questionAnswer, questionImage, questionOrderId, questionMap);
        }
        else {
          assesmentComplete();
        }
      }
    });
  }
}
function nextForm(thiss) {
  console.log("next clicked");

  var sendPreviewInfo;
  let questionTypeId = $(thiss).closest('div.previewPanel').attr('questiontype');
  let questionId = $(thiss).closest('div.previewPanel').attr('questionid');
  let questionSetId = $(thiss).closest('div.previewPanel').attr('questionsetid');
  let questionUniqueId = $(thiss).closest('div.previewPanel').attr('uniqueid');
  let questionOrderId = Number($(thiss).closest('div.previewPanel').attr('orderid'));
  let rowNumber = $(thiss).closest('div.previewPanel').find('span.mainformRowNumberP').text();
  let switchType = $(thiss).attr('typo');
  var validatError = false;
  // if (switchType== "next")
  // {
  //   $("div.previewPanel").addClass("animate__fadeInRight");
  //   $("div.previewPanel").removeClass("animate__fadeInLeft");
  // }
  // else
  // {
  //   $("div.previewPanel").removeClass("animate__fadeInRight");
  //   $("div.previewPanel").addClass("animate__fadeInLeft");
  // }
  switch (questionTypeId) {
    case '63ecb6fa814d072deeca3ad5':
      // Single Choice
      let singleAns;
      let singleButton = $(thiss).closest('div.previewPanel').find('input.singlePrevCheck');
      $(singleButton).each(function (i) {
        if ($(singleButton[i]).is(':checked')) {
          singleAns = $(singleButton[i]).val();
        }
      });
      sendPreviewInfo = {
        questionsetid: questionSetId,
        previousquestionid: questionId,
        unique: questionUniqueId,
        orderid: questionOrderId,
        answer: singleAns,
        type: switchType
      }
      break;
    case '63e0908a88ad9227fbe1cf6d':
      // Multiple Choice
      let choiceAns = [];
      let choiceButton = $(thiss).closest('div.previewPanel').find('input.multiPrevCheck');
      $(choiceButton).each(function (i) {
        if ($(choiceButton[i]).is(':checked')) {
          choiceAns.push($(choiceButton[i]).val())
        }
      });
      sendPreviewInfo = {
        questionsetid: questionSetId,
        previousquestionid: questionId,
        unique: questionUniqueId,
        orderid: questionOrderId,
        answer: choiceAns,
        type: switchType
      }
      break;
    case '63e0909488ad9227fbe1cf71':
      // Yes/No
      let ternaryAns = '';
      let ternaryButton = $(thiss).closest('div.previewPanel').find('input.yesnoradioP');
      $(ternaryButton).each(function (i) {
        if ($(ternaryButton[i]).is(':checked')) {
          ternaryAns = ($(ternaryButton[i]).val())
        }
      });
      sendPreviewInfo = {
        questionsetid: questionSetId,
        previousquestionid: questionId,
        unique: questionUniqueId,
        orderid: questionOrderId,
        answer: ternaryAns,
        type: switchType
      }
      break;
    case '63e090fa88ad9227fbe1cf9f':
      // Number
      let numberAns = $(thiss).closest('div.previewPanel').find('div.numberPrevAnswer');
      let numberAnsVal = $(numberAns).text();
      // console.log(switchType)
      if (switchType == 'next' && (!numberAnsVal || numberAnsVal == '')) {
        validatError = true;
        $(numberAns).focus();
      }
      else {
        validatError = false;
        sendPreviewInfo = {
          questionsetid: questionSetId,
          previousquestionid: questionId,
          unique: questionUniqueId,
          orderid: questionOrderId,
          answer: numberAnsVal,
          type: switchType
        }
      }
      break;
    case '63e0f69e88ad9227fbe206d9':
      // Text
      let textAns = $(thiss).closest('div.previewPanel').find('div.textPrevAnswer');
      let textAnsVal = $(textAns).text();
      // console.log(switchType)
      if (switchType == 'next' && (!textAnsVal || textAnsVal == '')) {
        validatError = true;
        $(textAns).focus();
      }
      else {
        validatError = false;
        sendPreviewInfo = {
          questionsetid: questionSetId,
          previousquestionid: questionId,
          unique: questionUniqueId,
          orderid: questionOrderId,
          answer: textAnsVal,
          type: switchType
        }
      }
      break;
  }
  console.info(sendPreviewInfo);
  // Ajax Call
  generateNextPreview(sendPreviewInfo, validatError, switchType, rowNumber);
}

var rowNumeric = 0;
function createPreviewForm(rowNo, questionSetId, questionTypeId, questionId, questionName, questionUniqueId, questionChoice, questionAnswer, questionImage, questionOrderId, questionMap) {
  if (!rowNo && rowNo == '') {
    rowNumeric++;
  }
  else {
    if ((rowNumeric) <= 1) {
      rowNumeric = 1;
    }
    else {
      rowNumeric--;
    }
  }
  switch (questionTypeId) {
    case '63ecb6fa814d072deeca3ad5':
      // Single Choice
      singleChoiceLayout(rowNumeric, questionSetId, questionTypeId, questionId, questionName, questionUniqueId, questionChoice, questionAnswer, questionImage, questionOrderId, questionMap);
      break;
    case '63e0908a88ad9227fbe1cf6d':
      // Multiple Choice
      multipleChoiceLayout(rowNumeric, questionSetId, questionTypeId, questionId, questionName, questionUniqueId, questionChoice, questionAnswer, questionImage, questionOrderId, questionMap);
      break;
    case '63e0909488ad9227fbe1cf71':
      // Yes/No
      ternaryChoiceLayout(rowNumeric, questionSetId, questionTypeId, questionId, questionName, questionUniqueId, questionChoice, questionAnswer, questionImage, questionOrderId, questionMap);
      break;
    case '63e090fa88ad9227fbe1cf9f':
      // Number
      numberTypeLayout(rowNumeric, questionSetId, questionTypeId, questionId, questionName, questionUniqueId, '', questionAnswer, questionImage, questionOrderId, questionMap);
      break;
    case '63e0f69e88ad9227fbe206d9':
      // Text
      textTypeLayout(rowNumeric, questionSetId, questionTypeId, questionId, questionName, questionUniqueId, '', questionAnswer, questionImage, questionOrderId, questionMap);
      break;
  }
}
// Single Choice Layout
function singleChoiceLayout(rowNumeric, questionSetId, questionTypeId, questionId, questionName, questionUniqueId, questionChoice, questionAnswer, questionImage, questionOrderId, questionMap) {
  let orderId = Number(questionOrderId);
  if (questionMap && questionMap != '') {
    let mapAnswer = getMapAnswer(questionMap, questionUniqueId);
    $(mapAnswer).each(function (i) {
      if (Array.isArray(mapAnswer[i].answer)) {
        let unParse = (mapAnswer[i].answer).join(', ');
        questionName = questionName.replace(/##SELECTTAG##/s, unParse);
      }
      else {
        questionName = questionName.replace(/##SELECTTAG##/s, ', ' + mapAnswer[i].answer);
      }
    });
    questionName = questionName.replace(/##SELECTTAG##/gm, '_____');
  }
  let imageURL = '';
  let fileNames = '';
  let typeFiles = '';
  let displayNone = '';
  let dPdf = '';
  let dExcel = '';
  let hide = 'd-none';
  // console.log("file name:" + questionImage);
  // fileNames = (questionImage).split(".")[0];
  // typeFiles = (questionImage).split(".")[1];
  // console.log("name:" + fileNames);
  // console.log("type:" + typeFiles);

  // // switch case start
  // switch (typeFiles) {
  //   case "jpeg":
  //   case "jpg":
  //   case "png":
  //     if (questionImage && questionImage != '') {
  //       imageURL = imageConvertBase64(questionImage, questionId);
  //     }
  //     if (imageURL != '') {
  //       hide = ''
  //     }
  //     break;
  //   case "pdf":
  //     if (fileNames == '') {
  //       displayNone = 'd-none';

  //       centerAlign = 'margin: 0px auto;';
  //     }
  //     else {
  //       dNone = 'd-none';
  //       dExcel = 'd-none';
  //       $("div.file-upload-box > h5").html(fileNames);
  //       $("div.file-upload-box > h6").html(typeFiles);
  //     }
  //     break;
  //   case "xls":
  //     if (fileNames == '') {
  //       displayNone = 'd-none';
  //       centerAlign = 'margin: 0px auto;';
  //     }
  //     else {
  //       dNone = 'd-none';
  //       dPdf = 'd-none';
  //       $("div.file-upload-box > h5").html(fileNames);
  //       $("div.file-upload-box > h6").html(typeFiles);
  //     }
  //     break;

  //   // code block
  // }

  let newSingleLayout = `<div class="multiple-choice-type d-flex flex-row w-100 h-100 singlePreviewParent previewPanel " questionid="${questionId}" questiontype="${questionTypeId}" questionsetid="${questionSetId}" uniqueid="${questionUniqueId}" orderid=${orderId}>
    <div class="w-50 ps-5 py-5 hide-scrollbar d-flex align-items-center" style="overflow-y:auto !important;display:block !important;">
      <div class="d-flex preview-single-choice align-items-start w-100 gap-4 flex-column  ">
        <div class="set-form-label d-flex gap-3 w-100 me-5">
          <span class="mainformRowNumberP">${rowNumeric}</span>
          <div class="d-flex flex-column w-100">
          <div type="text" class="singlePreviewinput" id="" objectid="${questionId}" placeholder="Your Question here" value="${questionName}">${questionName}</div>
              </div>
        </div>
        <div class="d-flex gap-2 flex-column choiceAnswers ms-4" id="choicePrevBtn${rowNumeric}">
                            
        </div>
      </div>
    </div>
    <div class="w-50 previewImgContainer">
      <img id="${questionId}" class="set-img-preview ${hide}"
        src="${imageURL}"
        alt="Image Crashed">
    </div>
    <div class="w-50  question-file-upload d-flex justify-content-center align-items-center ${displayNone}">
    <div class="file-upload-box">
    <div class="format-icon">
    <i class="fa-solid fa-file-pdf pdf-icon ${dPdf}"></i>
    <i class="fa-solid fa-file-excel xls-icon ${dExcel}"></i>
    <div class="question-download">
  <a  href='' title='Download' onclick="javascript:downloadFile('${questionImage}','${questionId}',event)">
    <i class="fa-solid fa-file-arrow-down "></i>
    </a>
    </div>
    </div>
    <h5>${fileNames}</h5>
    <h6>${typeFiles}</h6>
    </div>
    </div>
    <div class="preview-controls">
                  <button type="button" class="btn border-end previous" typo="previous" onclick="javascript:nextForm(this)">
                  <i class="fa-solid fa-chevron-left"></i>
                  </button>
                  <button type="button" class="btn next" typo="next" onclick="javascript:nextForm(this)">
                  <i class="fa-solid fa-chevron-right next"></i>
                  </button>
                </div>
  </div>`;
  $('#previewDiv').html(newSingleLayout);
  if (questionImage == null) {
    console.log("image");
    $('.previewPanel').addClass('container');
    $('.previewImgContainer').addClass('displaynone');
    $('.align-items-center').removeClass('w-50');
    $('.align-items-center').addClass('w-100');
    $('.align-items-center').removeClass('me-5');
  }
  for (x in questionChoice) {
    addPreviewSingleChoice(rowNumeric, questionChoice[x], questionId);
  }
  if (questionAnswer && questionAnswer != '') {
    console.info(questionAnswer);
    let choiceButtons = $(`button[questionid="${questionId}"]`).find('label.choiceLabels');
    $(choiceButtons).each(function (i) {
      for (y in questionAnswer) {

        console.log($(choiceButtons[i]).text());
        console.log(questionAnswer[y])

        if ($(choiceButtons[i]).text() == questionAnswer) {
          $(choiceButtons[i]).closest('div.tick').find('input[type=checkbox]').attr('checked', true);
        }
      }
    });
  }
}
var choiceSinglePrevBno = 0;
function addPreviewSingleChoice(rowNumeric, choiceText, questionId) {
  choiceSinglePrevBno++;
  let choiceAns = choiceText;
  console.log(choiceAns);
  // if (choiceAns && choiceAns.match(/\#COMMA\#/gm)) {
  //   choiceAns = choiceText.replace(/\#COMMA\#/gm, ',');
  // }

  let newChoiceBtn = `<button type="button" class="btn d-flex position-relative  justify-content-start btn-multiple-choie choiceButton" btnNumber="${choiceSinglePrevBno}" questionid="${questionId}" onclick="javascript:clickMultipleButton(this);singleClickPrevCheck(this)">
  <div class="img-option">
  <img src='${choiceAns.image_url}' id='' name="${choiceAns.imgName}" class="set-imgchoice">
     </div>
  <div class="form-check tick">
        <input class="form-check-input flex-shrink-0 singlePrevCheck" data-content="${String.fromCharCode(64 + (choiceSinglePrevBno))}" type="checkbox" value="${choiceAns}" id="choiceBtBox${choiceSinglePrevBno}" style="pointer-events: none;">
        <label class="form-check-label choiceLabels" id="" style="position:relative;top:2.8px;">${choiceAns.name}</label>
      </div>
    </button>`;
  $('#choicePrevBtn' + rowNumeric).append(newChoiceBtn);
  if(choiceAns.image_url != undefined){
    $(this).closest('button').find('.img-option').removeClass('d-none');
  }
}
function clickMultipleButton(thiss) {
  let checkboxButton = $(thiss).find('input[type="checkbox"]');
  if ($(checkboxButton).is(':checked')) {
    $(checkboxButton).attr('checked', false);
  }
  else {
    $(checkboxButton).attr('checked', true);
  }
}
function singleClickPrevCheck(thiss) {
  let checkBoxes = $(thiss).closest('div.singlePreviewParent').find('input.singlePrevCheck');
  $(checkBoxes).each(function (i) {
    $(checkBoxes[i]).prop('checked', false);
    $(checkBoxes[i]).prop('disabled', true);
  });
  $(thiss).find('input.singlePrevCheck').prop('checked', true);
  $(thiss).find('input.singlePrevCheck').prop('disabled', false);
}
// Multiple Choice Layout
function multipleChoiceLayout(rowNumeric, questionSetId, questionTypeId, questionId, questionName, questionUniqueId, questionChoice, questionAnswer, questionImage, questionOrderId, questionMap) {
  let orderId = Number(questionOrderId);
  let imageURL = '';
  if (questionMap && questionMap != '') {
    let mapAnswer = getMapAnswer(questionMap, questionUniqueId);
    $(mapAnswer).each(function (i) {
      if (Array.isArray(mapAnswer[i].answer)) {
        let unParse = (mapAnswer[i].answer).join(', ');
        questionName = questionName.replace(/##SELECTTAG##/s, unParse);
      }
      else {
        questionName = questionName.replace(/##SELECTTAG##/s, ', ' + mapAnswer[i].answer);
      }
    });
    questionName = questionName.replace(/##SELECTTAG##/gm, '_____');
  }
  let fileNames = '';
  let typeFiles = '';
  let displayNone= '';
  let dPdf = '';
  let dExcel= '';
  let hide = 'd-none';
  console.log("file name:" + questionImage);
  if(questionImage !=null){
  fileNames = (questionImage).split(".")[0];
  typeFiles = (questionImage).split(".")[1];
  console.log("name:" + fileNames);
  console.log("type:" + typeFiles);
  }

  // switch case start
  switch (typeFiles) {
    case "jpeg":
    case "jpg":
    case "png":
      if (questionImage && questionImage != '') {
        imageURL = imageConvertBase64(questionImage, questionId);
      }
      if (imageURL != '') {
        hide = ''
      }
    break;
    case "pdf":
      if (fileNames == '') {
        displayNone = 'd-none';

        centerAlign = 'margin: 0px auto;';
      }
      else {
        dNone = 'd-none';
        dExcel =  'd-none';
        $("div.file-upload-box > h5").html(fileNames);
        $("div.file-upload-box > h6").html(typeFiles);
      }
    break;
    case "xls":
      if (fileNames == '') {
        displayNone = 'd-none';
        centerAlign = 'margin: 0px auto;';
      }
      else {
        dNone = 'd-none';
        dPdf =  'd-none';
        $("div.file-upload-box > h5").html(fileNames);
        $("div.file-upload-box > h6").html(typeFiles);
      }
    break;

    // code block
  }




  // switch case end

  let newMultipleLayout = `<div class="multiple-choice-type d-flex flex-row w-100 h-100 multiPreviewParent previewPanel animate__animated animate__fast	800ms" questionid="${questionId}" questiontype="${questionTypeId}" questionsetid="${questionSetId}" uniqueid="${questionUniqueId}" orderid=${orderId}>
    <div class="w-50 ps-5 py-5 d-flex align-items-center hide-scrollbar" style="overflow:hidden !important; overflow-y:auto !important; display:block !important;">
      <div class="preview-multiple-choice d-flex align-items-start w-100 h-100 gap-4 flex-column ">
        <div class="set-form-label d-flex mb-5 gap-3 w-100 me-5 ">
          <span class="mainformRowNumberP">${rowNumeric}</span>
          <div class="d-flex flex-column w-100 ">
          <div type="text" class="multiplePreviewinput" id="" objectid="${questionId}" placeholder="Your Question here" value="${questionName}">${questionName}</div>
                    </div>
        </div>
        <div class="d-flex gap-2 flex-column ms-4 ps-2 choiceAnswers" id="choicePrevBtn${rowNumeric}">
                            
        </div>
      </div>
    </div>
    <div class="w-50 previewImgContainer ${hide}">
      <img id="${questionId}" class="set-img-preview "
        src="${imageURL}"
        alt="Image Crashed">
    </div>
    <div class="w-50  question-file-upload d-flex justify-content-center align-items-center ${displayNone}">
    <div class="file-upload-box">
    <div class="format-icon">
    <i class="fa-solid fa-file-pdf pdf-icon ${dPdf}"></i>
    <i class="fa-solid fa-file-excel xls-icon ${dExcel}"></i>
    <div class="question-download">
  <a  href='' title='Download' onclick="javascript:downloadFile('${questionImage}','${questionId}',event)">
    <i class="fa-solid fa-file-arrow-down "></i>
    </a>
    </div>
    </div>
    <h5>${fileNames}</h5>
    <h6>${typeFiles}</h6>
    </div>
    </div>
    <div class="preview-controls">
                  <button type="button" class="btn border-end previous" typo="previous" onclick="javascript:nextForm(this)">
                  <i class="fa-solid fa-chevron-left"></i>
                  </button>
                  <button type="button" class="btn next" typo="next" onclick="javascript:nextForm(this)">
                  <i class="fa-solid fa-chevron-right next"></i>
                  </button>
                </div>
  </div>`;
  $('#previewDiv').html(newMultipleLayout);
  if (questionImage == null) {
    console.log("image");
    $('.previewPanel').addClass('container');
    $('.previewImgContainer').addClass('displaynone');
    $('.align-items-center').removeClass('w-50');
    $('.align-items-center').addClass('w-100');
    $('.align-items-center').removeClass('me-5');
  }
  for (x in questionChoice) {
    addPreviewChoice(rowNumeric, questionChoice[x], questionId);
  }
  if (questionAnswer && questionAnswer != '') {
    console.info(questionAnswer);
    let choiceButtons = $(`button[questionid="${questionId}"]`).find('label.choiceLabels');
    $(choiceButtons).each(function (i) {
      for (y in questionAnswer) {
        if ($(choiceButtons[i]).text() == questionAnswer[y]) {
          $(choiceButtons[i]).closest('div.tick').find('input[type=checkbox]').attr('checked', true);
        }
      }
    });
  }
}
var choicePrevBno = 0;
function addPreviewChoice(rowNumeric, choiceText, questionId) {
  choicePrevBno++;
  let choiceAns = choiceText;
  // console.info({ choiceAns });
  if (choiceAns && choiceAns.match(/\#COMMA\#/gm)) {
    choiceAns = choiceText.replace(/\#COMMA\#/gm, ',');
  }
  let newChoiceBtn = `<button type="button" class="btn d-flex position-relative  justify-content-start btn-multiple-choie choiceButton" btnNumber="${choicePrevBno}" questionid="${questionId}" onclick="javascript:clickMultipleButton(this)">
      <div class="form-check tick">
        <input class="form-check-input flex-shrink-0 multiPrevCheck" data-content="${String.fromCharCode(64 + (choicePrevBno))}" type="checkbox" value="${choiceAns}" id="choiceBtBox${choicePrevBno}" style="pointer-events: none;">
        <label class="form-check-label choiceLabels" id="" style="position:relative;top:2.8px;">${choiceAns}</label>
      </div>
    </button>`;
  $('#choicePrevBtn' + rowNumeric).append(newChoiceBtn);
}
function clickMultipleButton(thiss) {
  let checkboxButton = $(thiss).find('input[type=checkbox]');
  if ($(checkboxButton).is(':checked')) {
    $(checkboxButton).attr('checked', false)
  }
  else {
    $(checkboxButton).attr('checked', true)
  }
}
// Yes Or No Layout
function ternaryChoiceLayout(rowNumeric, questionSetId, questionTypeId, questionId, questionName, questionUniqueId, questionChoice, questionAnswer, questionImage, questionOrderId, questionMap) {
  let orderId = Number(questionOrderId);
  let imageURL = '';
  let hide = 'invisible';
  if (questionMap && questionMap != '') {
    let mapAnswer = getMapAnswer(questionMap, questionUniqueId);
    $(mapAnswer).each(function (i) {
      if (Array.isArray(mapAnswer[i].answer)) {
        let unParse = (mapAnswer[i].answer).join(', ');
        questionName = questionName.replace(/##SELECTTAG##/s, unParse);
      }
      else {
        questionName = questionName.replace(/##SELECTTAG##/s, ', ' + mapAnswer[i].answer);
      }
    });
    questionName = questionName.replace(/##SELECTTAG##/gm, '_____');
  }
  if (questionImage && questionImage != '') {
    imageURL = imageConvertBase64(questionImage, questionId);
  }
  if (imageURL != '') {
    hide = ''
  }
  let newYesNoLayout = `<div class="yesorn0-type d-flex w-100 h-100 yesPreviewParent previewPanel animate__animated animate__fast	800ms" questionid="${questionId}" questiontype="${questionTypeId}" questionsetid="${questionSetId}" uniqueid="${questionUniqueId}" orderid=${orderId}>
  <div class="w-50 ps-5 py-5 d-flex align-items-center animate__animated  animate__fast	800ms">
    <div class="d-flex align-items-start w-100 gap-3 flex-column ">
      <div class="set-form-label d-flex w-100 gap-3 me-5">
        <span class="mainformRowNumberP">${rowNumeric}</span>
        <div class="d-flex flex-column w-100">
          <div type="text" class="yesnoinput" id="yesnoques${rowNumeric}" placeholder="Your Question here" value="${questionName}">${questionName}</div>
                 </div>
      </div>
      <div class="d-flex flex-column gap-2">
      <button type="button" class="btn d-flex justify-content-start btn-yesorno ms-4 ps-4" onclick="javascript:clickRadioButton(this);">
        <div class="form-check tickRadio">
          <input class="form-check-input yesnoradioP" type="radio" data-content="Y" name="flexRadioDefault${rowNumeric}" id="flexRadioDefault${rowNumeric}" value="${questionChoice[0]}" style="pointer-events: none;">
          <label class="form-check-label d-flex justify-content-start align-items-center radioLabelPreview mx-3" style="position:relative;">${questionChoice[0]}
          </label>
        </div>
      </button>
      <button type="button" class="btn d-flex justify-content-start btn-yesorno ms-4 ps-4" onclick="javascript:clickRadioButton(this);">
        <div class="form-check tickRadio">
          <input class="form-check-input yesnoradioP" type="radio" data-content="N" name="flexRadioDefault${rowNumeric}" id="flexRadioDefault${rowNumeric}" value="${questionChoice[1]}" style="pointer-events: none;">
          <label class=" form-check-label d-flex justify-content-start align-items-center radioLabelPreview mx-3" style="position:relative;">${questionChoice[1]}
          </label>
        </div>
      </button>
      </div>
    </div>
  </div>
  <div class="w-50 previewImgContainer">
      <img id="${questionId}" class="set-img-preview ${hide}"
        src="${imageURL}"
        alt="Image Crashed">
    </div>
  <div class="preview-controls">
                  <button type="button" class="btn border-end previous" typo="previous" onclick="javascript:nextForm(this)">
                  <i class="fa-solid fa-chevron-left "></i>
                  </button>
                  <button type="button" class="btn next" typo="next" onclick="javascript:nextForm(this)">
                  <i class="fa-solid fa-chevron-right next"></i>
                  </button>
                </div>
</div>`;
  $('#previewDiv').html(newYesNoLayout);
  if (questionImage == null) {
    console.log("image");
    $('.previewPanel').addClass('container');
    $('.previewImgContainer').addClass('displaynone');
    $('.align-items-center').removeClass('w-50');
    $('.align-items-center').addClass('w-100');
    $('.align-items-center').removeClass('me-5');
  }
  if (questionAnswer && questionAnswer != '') {
    console.info(questionAnswer);
    let radioButtons = $(`div.yesPreviewParent[questionid="${questionId}"]`).find('label.radioLabelPreview');
    $(radioButtons).each(function (i) {
      if ($(radioButtons[i]).text().trim() == $.trim(questionAnswer)) {
        $(radioButtons[i]).closest('div.tickRadio').find('input[type=radio]').attr('checked', true);
        $(radioButtons[i]).closest('div.tickRadio').find('input[type=radio]').change();
      }
    });
  }
}
function clickRadioButton(thiss) {
  let radioButton = $(thiss).find('input[type=radio]');
  $('.yesnoradioP').removeAttr('checked');
  if ($(radioButton).is(':checked')) {
    $(radioButton).attr('checked', false)
  }
  else {
    $(radioButton).attr('checked', true)
  }
}

// Number Layout
function numberTypeLayout(rowNumeric, questionSetId, questionTypeId, questionId, questionName, questionUniqueId, questionChoice, questionAnswer, questionImage, questionOrderId, questionMap) {
  let orderId = Number(questionOrderId);
  let imageURL = '';
  let hide = 'invisible';
  if (questionMap && questionMap != '') {
    let mapAnswer = getMapAnswer(questionMap, questionUniqueId);
    $(mapAnswer).each(function (i) {
      if (Array.isArray(mapAnswer[i].answer)) {
        let unParse = (mapAnswer[i].answer).join(', ');
        questionName = questionName.replace(/##SELECTTAG##/s, unParse);
      }
      else {
        questionName = questionName.replace(/##SELECTTAG##/s, ', ' + mapAnswer[i].answer);
      }
    });
    questionName = questionName.replace(/##SELECTTAG##/gm, '_____');
  }
  if (questionImage && questionImage != '') {
    imageURL = imageConvertBase64(questionImage, questionId);
  }
  if (imageURL != '') {
    hide = ''
  }
  let yourAnswer = '';
  if (questionAnswer && questionAnswer != '') {
    yourAnswer = questionAnswer;
    console.info({ yourAnswer });
  }
  let numberTypeLayout = `<div class="number-type d-flex w-100 h-100 numberPreviewParent previewPanel animate__animated animate__fast	800ms  " questionid="${questionId}" questiontype="${questionTypeId}" questionsetid="${questionSetId}" uniqueid="${questionUniqueId}" orderid=${orderId}>
    <div class="w-50 ps-5 py-5 d-flex align-items-center ">
      <div class="d-flex align-items-start w-100 gap-3 flex-column me-5 ">
        <div class="set-form-label w-100 d-flex gap-4">
        <span class="mainformRowNumberP">${rowNumeric}</span>
          <div class="d-flex w-100 align-items-start flex-column">
            <div type="text" class="numberQuestion w-100" id="numberQuestion${rowNumeric}" placeholder="Your Question here" value="${questionName}">${questionName}</div>
                      <div class="input-answer my-5 py-2 numberPrevAnswer pe-1 w-75 editable" contenteditable type="answer" onkeydown="javascript:onlyNumbers(event)" id="numberAnswer${rowNumeric}" data-placeholder="Type your answer here..." value="${yourAnswer}">${yourAnswer}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-50 previewImgContainer">
      <img id="${questionId}" class="set-img-preview ${hide}"
        src="${imageURL}"
        alt="Image Crashed">
    </div>
  <div class="preview-controls">
                  <button type="button" class="btn border-end previous" typo="previous" onclick="javascript:nextForm(this)">
                  <i class="fa-solid fa-chevron-left"></i>
                  </button>
                  <button type="button" class="btn next" typo="next" onclick="javascript:nextForm(this)">
                  <i class="fa-solid fa-chevron-right next"></i>
                  </button>
                </div>
</div>
`;
  $('#previewDiv').html(numberTypeLayout);
  if (questionImage == null) {
    console.log("image");
    $('.previewPanel').addClass('container');
    $('.previewImgContainer').addClass('displaynone');
    $('.align-items-center').removeClass('w-50');
    $('.align-items-center').addClass('w-100');
    $('.align-items-center').removeClass('me-5');
  }
}
// Text Layout
function textTypeLayout(rowNumeric, questionSetId, questionTypeId, questionId, questionName, questionUniqueId, questionChoice, questionAnswer, questionImage, questionOrderId, questionMap) {
  let orderId = Number(questionOrderId);
  let imageURL = '';
  let hide = 'invisible';
  if (questionMap && questionMap != '') {
    let mapAnswer = getMapAnswer(questionMap, questionUniqueId);
    $(mapAnswer).each(function (i) {
      if (Array.isArray(mapAnswer[i].answer)) {
        let unParse = (mapAnswer[i].answer).join(', ');
        questionName = questionName.replace(/##SELECTTAG##/s, unParse);
      }
      else {
        questionName = questionName.replace(/##SELECTTAG##/s, ', ' + mapAnswer[i].answer);
      }
    });
    questionName = questionName.replace(/##SELECTTAG##/gm, '_____');
  }
  if (questionImage && questionImage != '') {
    imageURL = imageConvertBase64(questionImage, questionId);
  }
  if (imageURL != '') {
    hide = ''
  }
  let yourAnswer = '';
  if (questionAnswer && questionAnswer != '') {
    yourAnswer = questionAnswer;
    // console.info({ yourAnswer });
  }
  let textTypeLayout = `<div class="text-type d-flex w-100 h-100 textPreviewParent previewPanel" questionid="${questionId}" questiontype="${questionTypeId}" questionsetid="${questionSetId}" uniqueid="${questionUniqueId}" orderid=${orderId}>
    <div class="w-50 ps-5 py-5 d-flex align-items-center ">
      <div class="d-flex align-items-start gap-3 w-100 flex-column me-5 animate__animated  animate__fast	800ms">
        <div class="set-form-label w-100 d-flex gap-4">
         <span class="mainformRowNumberP">${rowNumeric}</span>
          <div class="d-flex align-items-start w-100 flex-column">
            <div type="text" class="textQuestion w-100" id="textQuestion${rowNumeric}" placeholder="Your Question here" value="${questionName}">${questionName}</div>
           <!--<div class="small-input" type="small-text" id="">Description (Text)</div>-->
            <div class="input-answer my-5 py-2 textPrevAnswer pe-1 w-75 editable" type="answer" contenteditable id="textAnswer${rowNumeric}" data-placeholder="Type your answer here..." value="${yourAnswer}">${yourAnswer}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-50 previewImgContainer">
      <img id="${questionId}" class="set-img-preview ${hide}"
        src="${imageURL}"
        alt="Image Crashed">
    </div>
  <div class="preview-controls">
                  <button type="button" class="btn border-end previous" typo="previous" onclick="javascript:nextForm(this)">
                  <i class="fa-solid fa-chevron-left"></i>
                  </button>
                  <button type="button" class="btn next" typo="next" onclick="javascript:nextForm(this)">
                  <i class="fa-solid fa-chevron-right next"></i>
                  </button>
                </div>
</ >
    `;
  $('#previewDiv').html(textTypeLayout);
  if (questionImage == null) {
    console.log("image");
    $('.previewPanel').addClass('container');
    $('.previewImgContainer').addClass('displaynone');
    $('.align-items-center').removeClass('w-50');
    $('.align-items-center').addClass('w-100');
    $('.align-items-center').removeClass('me-5');
  }
}
function imageConvertBase64(imageName, questionId) {
  let base64 = '';
  // console.info(imageName, questionId);
  if (imageName && imageName != '') {
    $.ajax({
      type: "GET",
      data: {
        imagename: imageName
      },
      async: false,
      url: serverKey + "getimage",
      success: function (html) {
        let data = html?.data;
        base64 = data;
      }
    })
  }
  return "data:image/png;base64," + base64;
}
function getMapAnswer(questionMap, uniqueId) {
  let datas = '';
  $.ajax({
    type: "post",
    url: serverKey + "getmapquestion",
    async: false,
    data: JSON.stringify({
      questionsetid: uniqueKey,
      unique: uniqueId,
      mapquestion: questionMap
    }),
    contentType: "application/json; charset=utf-8",
    success: function (html) {
      datas = html?.data;
    }
  });
  console.info(datas);
  return datas;
}

// file downlload start...
function downloadFile(questionImage,questionId,event) {
  console.log("ok");  
  console.log(questionImage);
    let linkSource = imageConvertBase64(questionImage,questionId);
    let downloadLink = document.createElement("a");
    let fileName = questionImage;
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
    event.preventDefault();
  }

  
