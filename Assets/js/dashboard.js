// Vijay Start
document.addEventListener("DOMContentLoaded", (event) => {
  // $('.leftRow').click();
  $("input#formFile").change(function () {
    let fileType = '';
    var fileName = ''
    if (this.value != '') {
      let file = (this).files[0];
      var fileName = file.name;
      console.log(fileName);
      console.log(file);
      console.log(file.type);
      if ((file.type).match(/excel/gm)) {
        fileType = (file.type).split("-")[1];
        console.log(file.type);
      }
      else {
        fileType = (file.type).split("/")[1];
      }
      console.log(fileType);
    }
    switch (fileType) {
      case "jpeg":
      case "jpg":
      case "png":
        if (this.value == '') {
          $('.set-img').hide();
          $('.deleteImg').hide();
          $('.imageContainer').addClass('d-none');
        }
        else {
          $('.set-img').show();
          $('.deleteImg').show();
          $('.imageContainer').removeClass('d-none');
          $("div.question-file-upload").addClass('d-none');
        }
        break;
      case "pdf":
        if (this.value == '') {
          // $("div.imageContainer").hide();
        }
        else {
          $("div.imageContainer").addClass('d-none');
          $("div.question-file-upload").removeClass("d-none");
          $("div.file-upload-box > h5").html(fileName);
          $("div.file-upload-box > h6").html(fileType);
          $("i.pdf-icon").removeClass("d-none");
          $("i.xls-icon").addClass("d-none");
        }
        break;
      case "excel":

        if (this.value == '') {
          // $("div.imageContainer").show();
        }
        else {
          $("div.imageContainer").addClass('d-none');
          $("div.question-file-upload").removeClass("d-none");
          $("i.pdf-icon").addClass("d-none");
          $("i.xls-icon").removeClass("d-none");
          $("div.file-upload-box > h5").html(fileName);
          $("div.file-upload-box > h6").html(fileType);
        }
        break;

      // code block
    }
  });
  getQuestionForLeft('ready');
  $("#previewModal").on("hidden.bs.modal", function () {
    location.reload();
  });
  var thisElemSort;
  var hasMappedQuestion;
  var hasMappedSubId;
  var myModalV = new bootstrap.Modal(document.getElementById('confirmDrop'), {
    keyboard: false
  });
  var modalToggleV = document.getElementById('confirmDrop');
  $("#contentRows").sortable({
    revert: true,
    sort: function (event, ui) {
      thisElemSort = '';
      hasMappedSubId = '';
      hasMappedSubId = ui.item[0].attributes.id.nodeValue;
      let mappedQuestion = ui.item[0].attributes.mappedquestion.nodeValue;
      // console.info(hasMappedSubId);
      $(`div.leftRow[id="${hasMappedSubId}"]`).addClass('grabbing');
      hasMappedQuestion = (mappedQuestion && mappedQuestion != '') ? mappedQuestion : '';
      thisElemSort = (ui.item[0].innerText).replace(/\D+/gm, '');
      // console.info(hasMappedSubId);
    },
    stop: function (event, ui) {
      $(`div.leftRow`).removeClass('grabbing');
      let hasMappedTo = false;
      // console.info('sort stopped');
      onDragRowNum(ui);
      let leftRows = $('div.ui-state-default');
      let droppedElem = (ui.item[0].innerText).replace(/\D+/gm, '');
      leftRows.each(function (i) {
        let mappedQnTemp = $(this).attr('mappedquestion');
        let mappedQn = mappedQnTemp.split(',');
        let thisQnId = $(this).attr('id');
        // console.info({ hasMappedSubId, mappedQn });
        let matchFound = jQuery.inArray(hasMappedSubId, mappedQn);
        // console.info({ matchFound });
        if (matchFound && matchFound > 0) {
          let placedPos = $(`div[id="${hasMappedSubId}"]`).find('span.rowNumber').text();
          let mappedPos = $(`div[id="${thisQnId}"]`).find('span.rowNumber').text();
          // console.info({ placedPos, mappedPos });
          if (placedPos > mappedPos) {
            // console.info('placed pos.. greater than mapped to position');
            hasMappedTo = true;
            myModalV.show(modalToggleV);
          }
          else if (placedPos < mappedPos) {
            // console.info('placed pos.. lesser than mapped to position');
            hasMappedTo = false;
          }
        }
        else {
          if ((thisElemSort > droppedElem) || (thisElemSort < droppedElem)) {
            sendSortedRowData();
          }
        }
      });
      // console.info(hasMappedQuestion);
      if ((hasMappedQuestion && hasMappedQuestion != '')) {
        let hasMappedQn = hasMappedQuestion.split(',')
        let startRowIndex = thisElemSort;
        leftRows.each(function (i) {
          if (startRowIndex <= i + 1 && startRowIndex != droppedElem) {
            let belowQnId = $(this).attr('id');
            // console.info({belowQnId});
            let matchFounded = jQuery.inArray(belowQnId, hasMappedQn);
            // console.info({matchFounded});
            if (matchFounded && matchFounded > 0) {
              myModalV.show(modalToggleV);
            }
          }
        });
        // if ((thisElemSort > droppedElem)) {

        // }
      }
      else {
        if ((thisElemSort > droppedElem) || (thisElemSort < droppedElem)) {
          sendSortedRowData();
        }
      }
      // console.info({thisElemSort});
      // console.info(droppedElem);
      // if ((hasMappedQuestion && hasMappedQuestion != '')) {
      //   myModalV.show(modalToggleV);
      // }
      // else if((thisElemSort > droppedElem || thisElemSort < droppedElem)){
      //   myModalV.show(modalToggleV);
      // }
    }
  });
  $('body').tooltip({
    selector: '.deleteImg , .preview-tooltip'
  });
  $('select').niceSelect();
  $("#confirmDrop").on("hidden.bs.modal", function () {
    revertPosition();
  });
});
var modalConfirm = false;
let parameterId = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
const uniqueKey = parameterId.id;
const serverKey = "http://192.168.0.45:8001/api/";
var newFormType = false;
function confirmMoveIt() {
  modalConfirm = true;
  sendSortedRowData();
  $('select.includeAnswer').each(function () {
    let selectedVal = $(this).find('option:selected');
    if ($(selectedVal).val() == '0') {
      let mapId = $(this).closest('div.select').find('i').attr('selectorder');
      let oldMap = $('div.rowActive').attr('mappedquestion');
      let oldMapArr = oldMap.split(',');
      console.info(oldMapArr);
      oldMapArr.splice(mapId - 1, 1);
      console.info(oldMapArr);
      let updatedMap = oldMapArr.join(',');
      $('div.rowActive').attr('mappedquestion', updatedMap);
      $(this).closest('div.select').remove();

    }
  });
}
function sendSortedRowData() {
  let row = $('div.ui-state-default');
  let sendRowData = []
  $(row).each(function () {
    let questionId = $(this).attr('id');
    let orderNumber = $(this).find('span.rowNumber').text();
    let newObject = { questionid: questionId, orderid: Number(orderNumber) }
    sendRowData.push(newObject);
  });
  // console.info(sendRowData);
  $.ajax({
    type: "post",
    url: serverKey + "updateorder",
    async: false,
    data: JSON.stringify(sendRowData),
    contentType: "application/json; charset=utf-8",
    success: function (html) {
      let data = html?.data;
      // console.info(data);
    }
  });
}
function revertPosition() {
  console.info({ modalConfirm });
  if (!modalConfirm) {
    $('#contentRows').sortable('cancel');
    let questionid = $('div.rowActive').attr('id');
    $('div.leftRow').each(function (i) {
      $(this).find('.rowNumber').text(i + 1);
      $(this).find('label').attr('rowindex', i + 1);
    });
    mainRowNumber(questionid);
  }
  else {
    modalConfirm = false;
  }
}
function mainRowNumber(questionid) {
  let mainRowNum = $(`div.leftRow[id="${questionid}"]`).find('span.rowNumber').text();
  $('#contentQuesSet').find('span.mainformRowNumber').text(Number(mainRowNum));
  $(`div.leftRow[id="${questionid}"]`).click();
}
function onDragRowNum(ui) {
  let questionid = ui.item[0].id;
  $('div.leftRow').each(function (i) {
    $(this).find('.rowNumber').text(i + 1);
    $(this).find('label').attr('rowindex', i + 1);
  });
  mainRowNumber(questionid);
}
function getQuesType(fromApiData) {
  $.ajax({
    type: "GET",
    dataType: "json",
    async: false,
    url: serverKey + "getquestiontype/",
    success: function (data) {
      // console.info({data});
      fromApiData = data;
    }
  })
  return fromApiData.data
}
var gData = getQuesType();
var rowTypeColor = 'bg-blue';
var iconIndex_No = "1";
for (x in gData) {
  switch (gData[x]._id) {
    case '63ecb6fa814d072deeca3ad5':
      // Single Choice
      rowTypeColor = 'bg-violet';
      iconIndex_No = "1";
      break;
    case '63e0908a88ad9227fbe1cf6d':
      // Multiple Choice
      rowTypeColor = 'bg-blue';
      iconIndex_No = "2";
      break;
    case '63e0909488ad9227fbe1cf71':
      // Yes/No
      rowTypeColor = 'bg-red';
      iconIndex_No = "3";
      break;
    case '63e090fa88ad9227fbe1cf9f':
      // Number
      rowTypeColor = 'bg-green';
      iconIndex_No = "4";
      break;
    case '63e0f69e88ad9227fbe206d9':
      // Text
      rowTypeColor = 'bg-purple';
      iconIndex_No = "5";
      break;
  }
  let quesTypeBtn = `<li><button class="dropdown-item" objectid=${gData[x]._id} onclick="javascript:contentCreate(this)"> <span
  class="${rowTypeColor} question-type-icon-list rounded-3 fw-medium"><img class="question-icon" src="Assets/images/text-box-icon-0${iconIndex_No}.png" alt="..."></span>${gData[x].typename}</button></li>`;
  $('#questionTypes').append(quesTypeBtn);
}
function deleteConRow(trash) {
  console.info("deleting..");
  let objectId = $(trash).closest('div.leftRow').find('label').attr('objectid');
  let addy = serverKey + "deletequestion?questionid=" + objectId;
  console.info(addy);
  $.ajax({
    type: "DELETE",
    url: addy,
    success: function (html) {
      $(trash).closest('div.leftRow').remove();
      let rowNumber = $(trash).closest('div.leftRow').find('label.rowLabel').attr('rowindex');
      addConRowNum();
      $(`div.leftRow:nth-child(${rowNumber - 1})`).click();
      sendSortedRowData();
      let leftRowLength = $('div.leftRow:not(.invisible)').length;
      if (leftRowLength == 0) {
        location.reload();
      }
    }
  });
}
function addConRowNum() {
  $('div.leftRow').each(function (i) {
    $(this).find('.rowNumber').text(i + 1);
    $(this).find('label').attr('rowindex', i + 1);
  });
}
function rowContentBg(thiss) {
  $('.leftRow').removeClass('rowActive');
  $(thiss).addClass('rowActive');
  $('i.threeDot').addClass('invisible');
  $(thiss).find('i').removeClass('invisible');
  $('.form').addClass('hide');
  let rowLineId = $(thiss).attr('id');
  $(`div.form[id="${rowLineId}"]`).removeClass('hide');
  let questionId = $('div.rowActive').attr('id');
  let questionTypeId = $('div.rowActive').attr('originId');
  let questionData = { questionName: $('div.rowActive').attr('question'), questionAnswer: $('div.rowActive').attr('answer'), questionChoice: $('div.rowActive').attr('choice'), questionImage: $('div.rowActive').attr('imageid'), mapQuestions: $('div.rowActive').attr('mappedquestion') };
  loaderDiv($('div.rowActive').attr('imageid'), questionId);
  console.log(questionData)
  $("input#formFile").val('');
  $("input#formFile").change();
  contentRowCreate(questionTypeId, questionId, '', questionData);
}
function loaderDiv(file, questionId) {
  let fileType = "";
  let fileName = "";
  fileType = (file).split(".")[1];
  fileName = (file).split(".")[0];
  switch (fileType) {
    case "jpeg":
    case "jpg":
    case "png":
      $(`img.set-img[id="${questionId}"]`).removeClass("d-none");
      $("div.imageContainer").removeClass("d-none");
      $("div.question-file-upload").addClass("d-none");
      console.info({ questionId });
      break;
    case "pdf":
      $(`img.set-img[id="${questionId}"]`).addClass("d-none");
      $("div.question-file-upload").removeClass("d-none");
      $("div.imageContainer").addClass("d-none");
      $("div.file-upload-box > h5").html(fileName);
      $("div.file-upload-box > h6").html(fileType);
      $("i.pdf-icon").removeClass("d-none");
      $("i.xls-icon").addClass("d-none");

      break;
    case "xls":
      $(`img.set-img[id="${questionId}"]`).addClass("d-none");
      $("div.question-file-upload").removeClass("d-none");
      $("div.imageContainer").addClass("d-none");
      $("div.file-upload-box > h5").html(fileName);
      $("div.file-upload-box > h6").html(fileType);
      $("i.pdf-icon").addClass("d-none");
      $("i.xls-icon").removeClass("d-none");
      break;
    // code block
  }
}
var clicks = 0;
function updateForm() {
  if ($('div.leftRow:last').attr('save') == 'no') {
    let quesId = $('div.leftRow:last').attr('id');
    $(`div.leftRow[id="${quesId}"]`).remove();
  }
}
function contentCreate(thiss) {
  $('input#formFile').val('');
  let objectIdOrg = $(thiss).attr('objectid');
  let type = $(thiss).text();
  console.info(objectIdOrg, type);
  clicks += 1;
  let objectId = objectIdOrg + clicks;
  console.log(clicks);
  switch (objectIdOrg) {
    case '63ecb6fa814d072deeca3ad5':
      // Single Choice
      updateForm();
      contentRowCreate(objectIdOrg, objectId, type);
      break;
    case '63e0908a88ad9227fbe1cf6d':
      // Multiple Choice
      updateForm();
      contentRowCreate(objectIdOrg, objectId, type);
      break;
    case '63e0909488ad9227fbe1cf71':
      // Yes/No
      updateForm();
      contentRowCreate(objectIdOrg, objectId, type);
      break;
    case '63e090fa88ad9227fbe1cf9f':
      // Number
      updateForm();
      contentRowCreate(objectIdOrg, objectId, type);
      break;
    case '63e0f69e88ad9227fbe206d9':
      // Text
      updateForm();
      contentRowCreate(objectIdOrg, objectId, type);
      break;
  }
  $('#exampleModal').modal('hide');
}
function questionSetLabel(objectIdOrg, objectId, nameId, answerId, choiceId, imageName, mappedQues) {
  let questionName = (nameId) ? nameId : '';
  let questionAnswer = (answerId) ? answerId : '';
  let questionChoice = (choiceId) ? choiceId : '';
  questionChoice = JSON.stringify(questionChoice);
  let questionImage = (imageName) ? imageName : '';
  let mappedQuestion = (mappedQues) ? mappedQues : '';
  var hide = (questionName == '') ? "invisible" : '';
  var draggable = (hide == '') ? 'ui-state-default' : '';
  var rowIndexColor = 'bg-blue';
  var iconIndexNo = "1";
  console.log(questionChoice);
  switch (objectIdOrg) {
    case '63ecb6fa814d072deeca3ad5':
      // Single Choice
      rowIndexColor = 'bg-violet';
      iconIndexNo = "1";
      break;
    case '63e0908a88ad9227fbe1cf6d':
      // Multiple Choice
      rowIndexColor = 'bg-blue';
      iconIndexNo = "2";
      break;
    case '63e0909488ad9227fbe1cf71':
      // Yes/No
      rowIndexColor = 'bg-red';
      iconIndexNo = "3";
      break;
    case '63e090fa88ad9227fbe1cf9f':
      // Number
      rowIndexColor = 'bg-green';
      iconIndexNo = "4";
      break;
    case '63e0f69e88ad9227fbe206d9':
      // Text
      rowIndexColor = 'bg-purple';
      iconIndexNo = "5";
      break;
  }
  let saveAttr = (questionName == '') ? "no" : 'yes';
  let newRow = `<div class="question-list ${draggable} p-xxl-3 p-2 d-flex gap-2 justify-content-between align-items-center rowText leftRow ${hide}" id=${objectId} originid="${objectIdOrg}" question="${questionName}" answer="${questionAnswer}" choice='${questionChoice}' imageid="${questionImage}" onclick="javascript:rowContentBg(this)" save="${saveAttr}" questionid="${objectId}" mappedquestion="${mappedQuestion}">
      <label class="form-label d-flex gap-3 align-items-center rowLabel m-0" objectid=${objectId} rowindex="">
        <span class="${rowIndexColor} rounded-3 fw-medium question-icon-box d-flex rowFontSize"><img class="question-icon me-2"
            src="Assets/images/text-box-icon-01.png" alt="..."><span class="rowNumber ">Row Number</span></span><span class="questionData" objectid=${objectId}>${questionName.replace(/##SELECTTAG##/gm, '')}</span></label>
            <div class="dropdown">
              <button class="btn" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-three-dots-vertical threeDot invisible"></i>
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li><button class="dropdown-item" onclick="deleteConRow(this);return false;">Delete</button></li>
              </ul>
            </div>
    </div>`;
  $('#contentRows').append(newRow);
  addConRowNum();
}
function contentRowCreate(objectIdOrg, objectId, type, quesData) {
  if (type != '') {
    questionSetLabel(objectIdOrg, objectId);
  }
  switch (objectIdOrg) {
    case '63ecb6fa814d072deeca3ad5':
      // Single Choice
      singleChoiceType(objectId, objectIdOrg, quesData);
      $('.form').addClass('hide');
      $(`.singleParent[id="${objectId}"]`).removeClass('hide');
      break;
      break;
    case '63e0908a88ad9227fbe1cf6d':
      // Multiple Choice
      multipleChoiceType(objectId, objectIdOrg, quesData);
      $('.form').addClass('hide');
      $(`.multipleParent[id="${objectId}"]`).removeClass('hide');
      break;
    case '63e0909488ad9227fbe1cf71':
      // Yes/No
      yesRnoType(objectId, objectIdOrg, quesData);
      $('.form').addClass('hide');
      $(`.yesnoParent[id="${objectId}"]`).removeClass('hide');
      break;
    case '63e090fa88ad9227fbe1cf9f':
      // Number
      numberType(objectId, objectIdOrg, quesData);
      $('.form').addClass('hide');
      $(`.numberTypeParent[id="${objectId}"]`).removeClass('hide');
      break;
    case '63e0f69e88ad9227fbe206d9':
      // Text
      textType(objectId, objectIdOrg, quesData);
      $('.form').addClass('hide');
      $(`.textTypeParent[id="${objectId}"]`).removeClass('hide');
      break;
  }
}
function addChoiceSerial(rowNumber) {
  $(`button.choiceButton[rownumber="${rowNumber}"]`).each(function (i) {
    $(this).find('input[type="checkbox"]').attr('id', 'choiceCheck' + (i + 1));
    $(this).find('input[type="file"]').attr('id', 'openFile' + (i + 1));
    $(this).find('input[type="checkbox"]').attr('data-content', String.fromCharCode(64 + (i + 1)));
    $(this).find('label').attr('id', 'labelText' + (i + 1));
    $(this).find('label').attr('data-placeholder', 'Choice ' + (i + 1));
    $(this).closest('div.multipleParent').find('div.multiplechoiceinput').attr('id', 'multipleInputId' + (i + 1));
    $(this).closest('div.multipleParent').find('div.multiplechoiceDesc').attr('id', 'multipleDescId' + (i + 1));
  });
}
/******Sagunthala******* */
function getQuestionForLeft(status) {
  $.ajax({
    type: "GET",
    url: serverKey + "getquestion?questionsetid=" + uniqueKey,
    success: function (html) {
      let dataques = html?.data;
      if (dataques && dataques.length > 0) {
        console.info("Getting Data...");
        for (var val in dataques) {
          if (dataques.hasOwnProperty(val)) {
            questionSetLabel(dataques[val].questiontypeid, dataques[val]._id, dataques[val].questionname, dataques[val].answer, dataques[val].choice, dataques[val].qnDescImage, dataques[val].mapquestion);
          }
        }
        if (status == 'ready') {
          $('div.leftRow:first').click();
        }
      }
      else {
        // contentRowCreate("63e0908a88ad9227fbe1cf6d", "63e0908a88ad9227fbe1cf6d0", "Multiple Choice");
        welcomeScreen();
      }
    }
  })
}
/*****End********/
var calcChoiceLen = 0;
function addMultipleChoice(thiss, that, choice, iDs) {
  calcChoiceLen++;
  let objectId = (iDs) ? iDs : $(thiss).attr('objectid');
  var rowNumber;
  if (that) {
    rowNumber = that;
  }
  else {
    rowNumber = $(thiss).attr('rownumber');
  }
  let checkboxVal = (choice) ? choice.replace(/\#COMMA\#/gm, ',') : '';
  let newChoiceBtn = `<button type="button" class="btn d-flex flex-column position-relative gap-3  justify-content-start align-items-start btn-multiple-choie choiceButton" rownumber="${rowNumber}" questionid="" objectid="${objectId}">
  <div class="action-elements d-flex gap-2">
  <i class="bi bi-image-fill"></i>
  <i class="bi bi-trash3"></i>
  </div>
  <div class="img-option">
  <img src="https://images.unsplash.com/photo-1676815923805-8f8733a3824b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" alt="...">  
  </div>
  <div class="form-check tick">
      <input class="form-check-input flex-shrink-0 multipleCheckboxes" data-content='' type="checkbox" value="" id="">
      <label class="form-check-label editable pe-3" id="" contenteditable data-placeholder="" style="position:relative;">${checkboxVal}</label>
      <i class="bi bi-x-circle-fill close" onclick="javascript:$(this).closest('button.choiceButton').remove();addChoiceSerial();"></i>
    </div>
    <div class="choice-img-add">
    <i class="bi bi-image-fill">  
     <input class="form-control" type="file" id="" name="attachment[]" onchange="javascript:optionImage(this);" value='' />
    </i>
    </div>
  </button>`;
  $('#choiceButtons' + rowNumber).append(newChoiceBtn);
  addChoiceSerial(rowNumber);
}
function sendValtoCheckbox(thiss) {
  let label = $(thiss).closest('div.form').find('label.editable');
  let checkBox = $(thiss).closest('div.form').find('input.multipleCheckboxes');
  $(label).each(function (i) {
    $(checkBox[i]).val($(label[i]).text());
  });
}
function sendValToSingle(thiss) {
  let label = $(thiss).closest('div.form').find('label.editable');
  let checkBox = $(thiss).closest('div.form').find('input.singleCheckboxes');
  $(label).each(function (i) {
    $(checkBox[i]).val($(label[i]).text());
  });
}
function saveMainForm(thiss) {
  let parameterId = uniqueKey;
  console.info({ uniqueKey });
  let buttonText = $(thiss).text();
  let objectId = $(thiss).attr('objectid');
  let quesType = $(thiss).closest('div.form').attr('originid');
  let quesInput = '';
  let rowno = $(`div[id="${objectId}"]`).find(".mainformRowNumber").text();
  let getImage = $(thiss).closest('div.form').find('img.set-img').attr('name');
  let choiceAns = '';
  let mappedQuestion = '';
  let mappedArray = [];
  let mapquestion = $(thiss).closest('div.form').find('select.includeAnswer');
  if (mapquestion.length > 0) {
    let atPos = $(thiss).closest('div.form').find('div.atStyle:contains("@")');
    let tempSelect = $(atPos).closest('div.select').find('select.includeAnswer');
    mapquestion.each(function () {
      let selectedId = $(this).find('option:selected').attr('id');
      mappedArray.push(selectedId);
    });
    mappedQuestion = mappedArray;
    if ((mappedQuestion).includes(undefined)) {
      // console.info('select option');
      $(tempSelect).addClass('animate__animated animate__shakeX');
      return false;
    }
    else {
      // console.info('no prblm.');
      $('select.includeAnswer').removeClass('animate__animated animate__shakeX');
    }
    let newInput = $(thiss).closest('div.form').find('div[type="text"]').html().trim();
    newInput = newInput.replace(/<select([\S\s]*?)<\/select>/gm, '##SELECTTAG##').replace(/<[\/]{0,1}(div)[^><]*>/gm, '').replace(/<[\/]{0,1}(i)[^><]*>/gm, '').replace(/<ul([\S\s]*?)<\/ul>/gm, '').replace(/<span([\S\s]*?)<\/span>/gm, '').replace(/\s\s+/g, ' ').trim();
    quesInput = newInput;
    // console.info(newInput);
  }
  else {
    // console.info('no mapped question');
    mappedQuestion = '';
    quesInput = $(thiss).closest('div.form').find('div[type="text"]').text().trim();
  }
  let ansArray = []
  let checkboxVal = []
  let singleCheckboxVal = []
  let radioQues = []
  var sendInfo;
  // Image Upload Start
  let file = document.querySelector("input#formFile").files[0];
  let imageUniqueKey = new Date().getTime().toString(36);
  let imageName = (getImage && getImage != '') ? getImage : '';
  let singleImgName;
  if (file) {
    console.log("Uploading file...");
    const formData = new FormData();
    let fileBaseType = '' + file.type;
    let fileType = '';
    if ((fileBaseType).match(/excel/gm)) {
      fileType = "xls";
    }
    else {
      fileType = (fileBaseType).split("/")[1];
    }
    let myRenamedFile = new File([file], imageUniqueKey + '.' + fileType);
    formData.append('file', myRenamedFile);
    imageName = myRenamedFile.name;
    uploadFile(formData);
    // console.info(formData);
  }
  // Image Upload end
  if (quesType == '63ecb6fa814d072deeca3ad5') { //single choice
    let checkAnswer;
    let checkBox = $(thiss).closest('div.form').find('input.singleCheckboxes');
    let checkBoxButton = $(thiss).closest('div.form').find('button.singleButton');
    sendValToSingle(thiss);
    $(checkBox).each(function (i) {
      if ($(checkBox[i]).is(':checked')) {
        checkAnswer = (checkBox[i].value).replace(/,/gm, '#COMMA#');
        console.log(checkAnswer);
        if (checkAnswer == '') {
          checkAnswer = $(this).find('label.editable').attr('data-placeholder');
          console.log(checkAnswer);
        }
      }
    });
    $(checkBoxButton).each(function (i) {
      let checkQuestion = $(this).find('input[type="checkbox"]').val().replace(/,/gm, '#COMMA#');
      if (checkQuestion == '') {
        checkQuestion = $(this).find('label.editable').attr('data-placeholder');
        console.log(checkQuestion);
      }
      // singleCheckboxVal.push(checkQuestion);
      console.log(checkQuestion);
      // let labelname= attr('data-placeholder'); 

      choiceOptionImg = $(this).closest('button.singleButton').find('input[type="file"]').attr('id');
      console.log(choiceOptionImg);
      singleImgName = $(this).closest('button.singleButton').find('img.set-imgchoice').attr('name');
      console.log(singleImgName);

      const payload = {
        imgName: singleImgName,
        name: checkQuestion
      }
      singleCheckboxVal.push(payload);
      console.log(singleCheckboxVal);
    });
    let choiceOptions = singleCheckboxVal;
    // Data to Post call
    if (buttonText == 'Add') {
      sendInfo = {
        questiontypeid: quesType,
        questionsetid: parameterId,
        questionname: quesInput,
        qnDescImage: imageName,
        choice: choiceOptions,
        answer: checkAnswer,
        mapquestion: mappedQuestion
      }
    }
    else { //Update
      sendInfo = {
        questiontypeid: quesType,
        questionsetid: parameterId,
        questionid: objectId,
        questionname: quesInput,
        qnDescImage: imageName,
        choice: choiceOptions,
        answer: checkAnswer,
        mapquestion: mappedQuestion
      }
    }
  }
  else if (quesType == '63e0908a88ad9227fbe1cf6d') { //multiple choice
    let checkBox = $(thiss).closest('div.form').find('input.multipleCheckboxes');
    sendValtoCheckbox(thiss);
    $(checkBox).each(function (i) {
      if ($(checkBox[i]).is(':checked')) {
        let checkAnswer = (checkBox[i].value).replace(/,/gm, '#COMMA#');
        ansArray.push(checkAnswer);
      }
    });
    $(checkBox).each(function (i) {
      let checkQuestion = (checkBox[i].value).replace(/,/gm, '#COMMA#');
      checkboxVal.push(checkQuestion);
    });
    choiceAns = ansArray;
    let choiceOptions = checkboxVal;
    // Data to Post call
    if (buttonText == 'Add') {
      sendInfo = {
        questiontypeid: quesType,
        questionsetid: parameterId,
        questionname: quesInput,
        qnDescImage: imageName,
        choice: choiceOptions,
        answer: choiceAns,
        mapquestion: mappedQuestion
      }
    }
    else { //Update
      sendInfo = {
        questiontypeid: quesType,
        questionsetid: parameterId,
        questionid: objectId,
        questionname: quesInput,
        qnDescImage: imageName,
        choice: choiceOptions,
        answer: choiceAns,
        mapquestion: mappedQuestion
      }
    }
  }
  else if (quesType == '63e0909488ad9227fbe1cf71') { //yes or no
    let radioBtnO = $(thiss).closest('div.form').find('input.yesnoradio');
    let radioBtnQues = $(thiss).closest('div.form').find('label.editable');
    $(radioBtnO).each(function (i) {
      if ($(radioBtnO[i]).is(':checked')) {
        let radioAnswer = (radioBtnO[i].value).replace(/,/gm, '#COMMA#');
        choiceAns = radioAnswer;
      }
    });
    $(radioBtnQues).each(function (i) {
      let text = $(radioBtnQues[i]).text();
      let radioAnswer = (text).replace(/,/gm, '#COMMA#');
      radioQues.push(radioAnswer);
    });
    let radioQuestion = radioQues;
    if (buttonText == 'Add') {
      // Data to Post call
      sendInfo = {
        questiontypeid: quesType,
        questionsetid: parameterId,
        questionname: quesInput,
        qnDescImage: imageName,
        choice: radioQuestion,
        answer: choiceAns,
        mapquestion: mappedQuestion
      }
    }
    else {  //update
      sendInfo = {
        questiontypeid: quesType,
        questionsetid: parameterId,
        questionid: objectId,
        questionname: quesInput,
        qnDescImage: imageName,
        choice: radioQuestion,
        answer: choiceAns,
        mapquestion: mappedQuestion
      }
    }
  }
  else if (quesType == '63e090fa88ad9227fbe1cf9f') { //Number
    choiceAns = $(thiss).closest('div.form').find('div.numberAnswer').text();
    if (buttonText == 'Add') {
      // Data to Post call
      sendInfo = {
        questiontypeid: quesType,
        questionsetid: parameterId,
        questionname: quesInput,
        qnDescImage: imageName,
        answer: choiceAns,
        mapquestion: mappedQuestion
      }
    }
    else { //Update
      sendInfo = {
        questiontypeid: quesType,
        questionsetid: parameterId,
        questionid: objectId,
        questionname: quesInput,
        qnDescImage: imageName,
        answer: choiceAns,
        mapquestion: mappedQuestion
      }
    }
  }
  else if (quesType == '63e0f69e88ad9227fbe206d9') { //Text
    choiceAns = $(thiss).closest('div.form').find('div.textAnswer').text();
    if (buttonText == 'Add') {
      // Data to Post call
      sendInfo = {
        questiontypeid: quesType,
        questionsetid: parameterId,
        questionname: quesInput,
        qnDescImage: imageName,
        answer: choiceAns,
        mapquestion: mappedQuestion
      }
    }
    else { //Update
      sendInfo = {
        questiontypeid: quesType,
        questionsetid: parameterId,
        questionid: objectId,
        questionname: quesInput,
        qnDescImage: imageName,
        answer: choiceAns,
        mapquestion: mappedQuestion
      }
    }
  }
  console.info(sendInfo);
  if (quesInput != '') {
    $.ajax({
      type: "post",
      url: serverKey + "storequestion",
      async: false,
      data: JSON.stringify(sendInfo),
      contentType: "application/json; charset=utf-8",
      traditional: true,
      success: function (data) {
        //   console.info(data);
        $(`div.leftRow[id="${objectId}"]`).attr('save', 'yes');
        if ($(`div.leftRow[id="${objectId}"]`).attr('save') == 'yes') {
          $(`div.leftRow[id="${objectId}"]`).remove();
        }
        $('#contentRows').empty();
        $(`div.form[id="${objectId}"]`).empty();
        getQuestionForLeft();
        successfulyAdd(buttonText);
      },
    });
  }
  else {
    // console.info('Choose Options');
  }
}
function showImage() {
  let file = document.querySelector("input#formFile").files[0];
  if (file) {
    if (file.size >= 1 && file.size <= 2000000) { //Image should be > 2mb (2000000 bytes)
      $('.imageSizeValidate').addClass('d-none');
      let questionId = $('div#contentQuesSet').find('.form').attr('id');
      let blob = new Blob([file], { type: file.type });
      let url = URL.createObjectURL(blob);
      let fileType = '';
      if ((file.type).match(/excel/gm)) {
        fileType = (file.type).split("-")[1];
        console.log(file.type);
      }
      else {
        fileType = (file.type).split("/")[1];
      }
      switch (fileType) {
        case "jpeg":
        case "jpg":
        case "png":
          $(`img.set-img[id="${questionId}"]`).attr('src', url);
          $(`img.set-img[id="${questionId}"]`).removeClass("d-none");
          $("div.imageContainer").removeClass("d-none");
          $("div.question-file-upload").addClass("d-none");
          console.info({ questionId });
          break;
        case "pdf":
          $(`img.set-img[id="${questionId}"]`).addClass("d-none");
          $("div.question-file-upload").removeClass("d-none");
          $("div.imageContainer").addClass("d-none");
          $("div.file-upload-box > h5").html(file.name);
          $("div.file-upload-box > h6").html(fileType);
          $("i.pdf-icon").removeClass("d-none");
          $("i.xls-icon").addClass("d-none");
          break;
        case "excel":
          $(`img.set-img[id="${questionId}"]`).addClass("d-none");
          $("div.question-file-upload").removeClass("d-none");
          $("div.imageContainer").addClass("d-none");
          $("div.file-upload-box > h5").html(file.name);
          $("div.file-upload-box > h6").html(fileType);
          $("i.pdf-icon").addClass("d-none");
          $("i.xls-icon").removeClass("d-none");
          break;
        // code block
      }
    }
    else {
      $('.imageSizeValidate').removeClass('d-none');
      $("input#formFile").val('');
      $("input#formFile").change();
    }
  }
}
function welcomeScreen() {
  let successText = `<div class="welcomeDiv h-100 w-100">
  <h1 class="empty-question">PLEASE SELECT QUESTION TYPE</h1>
  </div>`;
  $('#contentQuesSet').html(successText);
}
function addSelectValue(thiss, questionId) {
  let selectOption = $(thiss).closest('div.form').find('select.includeAnswer');
  let thisRowNumber = $(thiss).closest('div.form').find('span.mainformRowNumber');
  let activeRowNumber = $(`div.rowActive`).find('span.rowNumber');
  let selectedArray = []
  selectOption.each(function () {
    let selectedId = $(this).find('option:selected').attr('id');
    selectedArray.push(selectedId)
  });
  if (thisRowNumber == activeRowNumber) {
    newFormType = false;
    $(`div.rowActive[id=${questionId}]`).attr('mappedquestion', selectedArray);
  }
  else {
    newFormType = true;
    $(`div.leftRow:last`).attr('mappedquestion', selectedArray);
  }
}
function createMapSelect(str, thiss, indexOfAt, mapCount) {
  let questionId = $(thiss).closest('div.form').attr('id');
  let orderId = Number($(thiss).closest('div.form').find('span.mainformRowNumber').text());
  $(thiss).closest('div.form').find('div[type="text"]').attr('contenteditable', false);
  let optionArr = [];
  let selectElem = '<div class="editable mapQuestion mb-2 selectControl" contenteditable onkeydown="javascript:keyboardFunc(event,this);" data-focus-visible data-placeholder="Type...">' + str.slice(0, indexOfAt) + `
  <div class="select d-flex mx-1 selectControl" contenteditable="false" mapquestionid="" orderid="${orderId}" style="position:relative;">
  <i class="bi bi-x-circle-fill selectClose" selectorder=${mapCount} onclick="javascript:deleteSelectOption(this,'${questionId}')"></i>
  <div class="atStyle">${str[indexOfAt]}</div>
    <select class="includeAnswer" onchange="javascript:$(this).closest('.select').find('div.atStyle').remove();addSelectValue(this,'${questionId}')" id="includeAnswer${mapCount}" aria-label="Default select example">
    </select>
  </div>` + '</div>' + '<div class="editable mapQuestion mb-2 selectControl" contenteditable data-focus-visible onkeydown="javascript:keyboardFunc(event,this);" data-placeholder="..">' + str.slice(indexOfAt + 1) + '</div>';
  $(thiss).html(selectElem);
  $('select').niceSelect();
  $.ajax({
    type: "post",
    url: serverKey + "mapquestion",
    async: false,
    data: JSON.stringify({
      questionsetid: uniqueKey,
      questionid: questionId,
      orderid: orderId
    }),
    contentType: "application/json; charset=utf-8",
    success: function (html) {
      let data = html?.data;
      console.info(data);
      for (x in data) {
        let newOption = `<option id="${data[x]._id}" value="${(data[x].questionname).replace(/##SELECTTAG##/gm, '')}">${Number(x) + 1}. ${(data[x].questionname).replace(/##SELECTTAG##/gm, '')}</option>`;
        optionArr.push(newOption);
      }
      $(`#includeAnswer${mapCount}`).html('<option data-display="Select" value="0">Select Question</option>' + optionArr);
      let mapQues = '';
      if (newFormType) {
        mapQues = $(`div.leftRow:last`).attr('mappedquestion');
      }
      else {
        mapQues = $(`div.rowActive[id=${questionId}]`).attr('mappedquestion');
      }
      // let mapSelect = $('select.inclueAnswer');
      if (mapQues && mapQues != '') {
        let mappedquestion = mapQues.split(',');
        for (y in mappedquestion) {
          console.info(y + '=' + mappedquestion[y]);
          $(`#includeAnswer${Number(y) + 1}` + ' option[id="' + mappedquestion[y] + '"]').prop('selected', true);
        }
      }
    }
  });
  $('select').niceSelect('update');
}
function keyboardFunc(e, thiss) {
  let keyValue = e.key;
  let textDiv = $(thiss).find('div.editable').html();
  // console.log(event.code);
  if (event.code == "Enter") {
    event.preventDefault();
  }
  if (event.code == "Backspace") {
    // event.preventDefault();
    // console.info(textDiv);
  }
}
function includeAnswerHere(e, thiss) {
  let mapCount = $('select.includeAnswer').length + 1;
  let keyValue = e.key;
  // console.log(event.code);
  let clone = $(thiss).html().trim();
  // console.info(clone);
  let str = clone;
  let atCount = (str.match(/@/gm) || []).length;
  let atPresent = false;
  if (atCount <= 1) {
    atPresent = false;
    $('.includeAnswer:last').removeClass('animate__animated animate__shakeX');
  }
  else {
    atPresent = true;
    $('.includeAnswer:last').addClass('animate__animated animate__shakeX');
  }
  // console.info({atPresent});
  if (!atPresent && keyValue.match(/@/gm)) {
    let indexOfAt = clone.indexOf("@");
    console.info(' "@ present" ' + indexOfAt + ' Position');
    createMapSelect(str, thiss, indexOfAt, mapCount);
  }
}
function successfulyAdd(buttonText) {
  let statusText = (buttonText == 'Add') ? buttonText + 'ed' : buttonText + 'd';
  let successText = `  <div class="toast w-25 success shadow fade show" role="alert" aria-live="assertive" aria-atomic="true">
  <div class=" d-flex align-items-center justify-content-center p-3 py-4 gap-3 ">
    <i class="fa-solid fa-circle-check"></i>
  <strong class="me-auto success-color fs-5">${"Question " + statusText + ' Successfully'}</strong>
  <i class="bi bi-x-lg toaster-close"></i>
  </div>
  </div>`;
  $('#contentQuesSet').html(successText);
  setTimeout(function () {
    $('#contentQuesSet').find('div.toast').fadeOut('slow');
  }, 3000);
}
function uploadFile(formData) {
  $.ajax({
    url: serverKey + "uploadimage",
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function (data) {
      console.info({ data });
    },
    error: function () {
      console.log("Error please try again");
    }
  });
}
function addValueToCheckbox(thiss) {
  let labelText = $(thiss).text();
  $(thiss).closest('div.tick').find('input.multipleCheckboxes').val(labelText)
}
function clipboardPaste(e, thiss) {
  e.preventDefault();
  let text = (e.originalEvent || e).clipboardData.getData('text/plain');
  $(thiss).text(text)
}
function multipleChoiceType(objectId, objectIdOrg, quesData) {
  // console.info(quesData);
  let questionVal = '';
  let answerVal = '';
  let choiceVal = '';
  let imageName = '';
  let imageSrc = '';
  let dNone = '';
  let fileName = "Choose File";
  let typeFile = "Type";
  let displayNone = '';
  let dPdf = '';
  let dExcel = '';
  let centerAlign = '';
  let mappedQuestion = '';
  if (quesData) {
    questionVal = (quesData.questionName) ? quesData.questionName : '';
    answerVal = (quesData.questionAnswer) ? quesData.questionAnswer : '';
    choiceVal = (quesData.questionChoice) ? quesData.questionChoice : '';
    imageName = (quesData.questionImage) ? quesData.questionImage : '';
    mappedQuestion = (quesData.mapQuestions) ? quesData.mapQuestions : '';
    // console.log({imageName});
    fileName = (imageName).split(".")[0];
    typeFile = (imageName).split(".")[1];

    // switch start
    switch (typeFile) {
      case "jpeg":
      case "jpg":
      case "png":
        if (imageName != '') {
          imageSrc = imageParser(imageName, objectId);
          displayNone = 'd-none';
        }
        else {
          dNone = 'd-none';
          centerAlign = 'margin: 0px auto;';
        }
        break;
      case "pdf":
        if (fileName == '') {
          displayNone = 'd-none';
          centerAlign = 'margin: 0px auto;';
        }
        else {
          dNone = 'd-none';
          dExcel = 'd-none';
          $("div.file-upload-box > h5").html(fileName);
          $("div.file-upload-box > h6").html(typeFile);
        }
        break;
      case "xls":
        if (fileName == '') {
          displayNone = 'd-none';
          centerAlign = 'margin: 0px auto;';
        }
        else {
          dNone = 'd-none';
          dPdf = 'd-none';
          $("div.file-upload-box > h5").html(fileName);
          $("div.file-upload-box > h6").html(typeFile);
        }
        break;

      // code block
    }
    // start end
  }
  else {
    dNone = 'd-none';
    displayNone = 'd-none';
    dPdf = '';
    dExcel = '';
    centerAlign = 'margin: 0px auto;';
  }
  let rowNumber = $(`div[id="${objectId}"]`).find('.rowNumber').text();
  let submitText = (quesData) ? 'Update' : 'Add';
  let newMultipleLayout = `<div class="multiple-choice-type d-flex flex-row w-100 h-100 multipleParent form hide " id="${objectId}" originid="${objectIdOrg}">
   <div class="w-50 changePosition hide-scrollbar px-5 py-5  d-flex align-items-center position-relative" style="overflow-y:auto !important;display:block !important;${centerAlign}">
      <div class="multichoice-center d-flex align-items-start w-100 gap-4 flex-column">
        <div class="set-form-label d-flex gap-3 w-100">
          <span class="mainformRowNumber">${rowNumber}</span>
          <div class="d-flex flex-column w-100">
          <div type="text" class="w-100 multiplechoiceinput editable" contenteditable id="" objectid="${objectId}" onkeydown="javascript:keyboardFunc(event,this)" onkeyup="javascript:includeAnswerHere(event,this)" data-placeholder="Your Question here" onpaste="javascript:clipboardPaste(event,this);" value="${questionVal}">${questionVal}</div>
          </div>
        </div>
        <div class="d-flex gap-2 flex-column ms-4" id="choiceButtons${rowNumber}">
                            
        </div>
        <button type="button" class="btn btn-link p-0 ms-4" objectid="${objectId}" rownumber="${rowNumber}" onclick="javascript:addMultipleChoice(this);">
          Add Choice
        </button>
        <button type="button" class="btn question-button ms-4" objectid="${objectId}" rownumber="${rowNumber}" onclick="saveMainForm(this)">${submitText}</button>
      </div>
      
    </div>
    <div class="w-50 imageContainer ${dNone}">
    <button class="btn deleteImg" onclick="javascript:deleteImage(this);return false;" data-bs-toggle="tooltip" data-bs-placement="top" title="Remove"><i class="bi bi-trash-fill imgTrash"></i></button>
      <img id=${objectId} name="${imageName}" class="set-img"
        src="${imageSrc}"
        alt="Image Crashed">
    </div>
    <div class="w-50  question-file-upload d-flex justify-content-center align-items-center ${displayNone}">
    <div class="file-upload-box">
    <div class="format-icon">
    <i class="fa-solid fa-file-pdf pdf-icon ${dPdf}"></i>
    <i class="fa-solid fa-file-excel xls-icon ${dExcel}"></i>
    </div>
    <h5>${fileName}</h5>
    <h6>${typeFile}</h6>
    </div>
    </div>
  </div>`;
  $('#contentQuesSet').html(newMultipleLayout);
  if (quesData) {
    let choiceArr = choiceVal.split(',');
    let answerArr = answerVal.split(',');
    for (x in choiceArr) {
      addMultipleChoice('', rowNumber, choiceArr[x], objectId);
    }
    let choiceButtons = $(`button[objectid="${objectId}"]`).find('label.editable');
    $(choiceButtons).each(function (i) {
      for (y in answerArr) {
        // console.info($(choiceButtons[i]).text(),answerArr[y].replace(/\#COMMA\#/gm, ','));
        if ($(choiceButtons[i]).text() == answerArr[y].replace(/\#COMMA\#/gm, ',') && $(choiceButtons[i]).text() != '') {
          $(choiceButtons[i]).closest('div.tick').find('input[type=checkbox]').attr('checked', true);
        }
      }
    });
  }
  else {
    addMultipleChoice('', rowNumber, '', objectId);
    addMultipleChoice('', rowNumber, '', objectId);
  }
  if (mappedQuestion && mappedQuestion != '') {
    unParseSelect(objectId);
  }
}
function singleChoiceType(objectId, objectIdOrg, quesData) {
  // console.info(quesData);
  let questionVal = '';
  let answerVal = '';
  let choiceVal = '';
  let imageName = '';
  let imageSrc = '';
  let dNone = '';
  let fileName = "Choose File";
  let typeFile = "Type";
  let displayNone = '';
  let dPdf = '';
  let dExcel = '';
  let centerAlign = '';
  let mappedQuestion = '';
  console.log(quesData);
  if (quesData) {
    questionVal = (quesData.questionName) ? quesData.questionName : '';
    answerVal = (quesData.questionAnswer) ? quesData.questionAnswer : '';
    choiceVal = (quesData.questionChoice) ? JSON.parse(quesData.questionChoice) : '';
    imageName = (quesData.questionImage) ? quesData.questionImage : '';
    mappedQuestion = (quesData.mapQuestions) ? quesData.mapQuestions : '';
   
  }

  let rowNumber = $(`div[id="${objectId}"]`).find('.rowNumber').text();
  let submitText = (quesData) ? 'Update' : 'Add';
  let newSingleLayout = `<div class=" multiple-choice-type d-flex flex-row w-100 h-100 singleParent form hide" id="${objectId}" originid="${objectIdOrg}">
    <div class="w-50 changePosition hide-scrollbar px-5 py-5 d-flex align-items-center"  style="overflow-y:auto !important;display:block !important;${centerAlign}">
      <div class="d-flex single-choice align-items-start w-100 gap-4 flex-column">
        <div class="set-form-label d-flex gap-3 w-100">
          <span class="mainformRowNumber">${rowNumber}</span>
          <div class="d-flex flex-column w-100">
          <div type="text" class="singlechoiceinput w-100 pe-4 editable" contenteditable id="" objectid="${objectId}" onkeydown="javascript:keyboardFunc(event,this)" onkeyup="javascript:includeAnswerHere(event,this)" data-placeholder="Your Question here" onpaste="javascript:clipboardPaste(event,this);" value="${questionVal}">${questionVal}</div>
          </div>
        </div>
        <div class="d-flex gap-2 flex-column ms-4" id="choiceButtons${rowNumber}">
                            
        </div>
        <button type="button" class="btn btn-link p-0 ms-4" objectid="${objectId}" rownumber="${rowNumber}" onclick="javascript:addSingleChoice(this);">
          Add Choice
        </button>
        <button type="button" class="btn question-button ms-4" objectid="${objectId}" rownumber="${rowNumber}" onclick="saveMainForm(this)">${submitText}</button>
      </div>
    </div>
    <div class="w-50 imageContainer ${dNone}">
    <button class="btn deleteImg" onclick="javascript:deleteImage(this);return false;" data-bs-toggle="tooltip" data-bs-placement="top" title="Remove"><i class="bi bi-trash-fill imgTrash"></i></button>
      <img id=${objectId} name="${imageName}" class="set-img"
        src="${imageSrc}"
        alt="Image Crashed">
    </div>
    <div class="w-50  question-file-upload d-flex justify-content-center align-items-center ${displayNone}">
    <div class="file-upload-box">
    <div class="format-icon">
    <i class="fa-solid fa-file-pdf pdf-icon ${dPdf}"></i>
    <i class="fa-solid fa-file-excel xls-icon ${dExcel}"></i>
    </div>
    <h5>${fileName}</h5>
    <h6>${typeFile}</h6>
    </div>
    </div>
  </div>`;
  $('#contentQuesSet').html(newSingleLayout);
  if (quesData) {
    let choiceArr = choiceVal;
    let answerArr = answerVal.split(',');
    for (x in choiceArr) {
      addSingleChoice('', rowNumber, choiceArr[x], objectId);
    }
    let choiceButtons = $(`button[objectid="${objectId}"]`).find('label.editable');
    $(choiceButtons).each(function (i) {
      for (y in answerArr) {
        if ($(choiceButtons[i]).text() == answerArr[y].replace(/\#COMMA\#/gm, ',') && $(choiceButtons[i]).text() != '') {
          $(choiceButtons[i]).closest('div.tick').find('input[type=checkbox]').attr('checked', true);
        }
      }
    });
  }
  else {
    addSingleChoice('', rowNumber, '', objectId);
    addSingleChoice('', rowNumber, '', objectId);
  }
  if (mappedQuestion && mappedQuestion != '') {
    unParseSelect(objectId);
  }
}
function addSingleChoice(thiss, that, choice, iDs) {
  let objectId = (iDs) ? iDs : $(thiss).attr('objectid');
  var rowNumber;
  let imageSrc;
  let choiceOptionImg;
  let imgchoiceId;
  let checkboxVal = '';
  let imgUrl = '';
  if (that) {
    rowNumber = that;
  }
  else {
    rowNumber = $(thiss).attr('rownumber');
  }
  //sagunthala
  // let uploadImgName = $(this).attr("name");
  // console.log(uploadImgName);
  let uploadImgName;
  let choiceArray;
  //End

  if (choice) {
    console.log(JSON.stringify(choice));
    choiceArray = JSON.stringify(choice);
    checkboxVal = (choice.name) ? choice.name.replace(/\#COMMA\#/gm, ',') : '';
    imgUrl = choice.image_url;
    uploadImgName = choice.imgName;
    if (imgUrl == undefined) {
      $(this).closest('button.singleButton').find('.img-option').addClass('d-none');
    }
    else {
      $(this).closest('button.singleButton').find('.img-option').removeClass('d-none');
    }
  }
  let newChoiceBtn = `<button type="button" class="btn d-flex flex-column gap-3 position-relative  justify-content-start btn-multiple-choie singleButton" rownumber="${rowNumber}" questionid="" objectid="${objectId}" choice='${choiceArray}'>
  <div class="action-elements d-flex gap-2">
  <i class="bi bi-image-fill"></i>
  <i class="bi bi-trash3" onclick="javascript:deleteOptionImage(this)"></i>
  </div>
  <div class="img-option d-none">
<img src='${imgUrl}' id='' name="${uploadImgName}" class="set-imgchoice">
   </div>
  
  <div class="form-check tick">
      <input class="form-check-input flex-shrink-0 singleCheckboxes" type="checkbox" data-content='' value="" id="" onchange="javascript:singleClickCheck(this);">
      <label class="form-check-label editable" id="" contenteditable data-placeholder="" style="position:relative;">${checkboxVal}</label>
      <i class="bi bi-x-circle-fill close" onclick="javascript:$(this).closest('button.singleButton').remove();addSingleChoiceNo();"></i>
    </div>
    <div class="choice-img-add">
    <input class="form-control" type="file" id="" name="" onchange="javascript:optionImage(this);" value='' />
    <i class="bi bi-image-fill">
    </i>
    </div>
  </button>

  `;
  $('#choiceButtons' + rowNumber).append(newChoiceBtn);


  $('.choice-img-add').each(function (i) {
    choiceOptionImg = $(this).closest('button.singleButton').find('input[type="file"]').attr('id');
    $(this).closest('button.singleButton').find('img.set-imgchoice').attr('id', choiceOptionImg);
    if (choice) {
      imgUrl = choice.image_url;
      // $(this).closest('button.singleButton').find(`img.set-imgchoice[id="${choiceOptionImg}"]`).attr('src', imgUrl);
      if (imgUrl != undefined || imgName != null) {
        $(this).closest('button.singleButton').find('.img-option').removeClass('d-none');
      }
    }
  })
  addSingleChoiceNo(rowNumber);
}
function singleClickCheck(thiss) {
  let checkBoxes = $(thiss).closest('div.singleParent').find('input.singleCheckboxes');
  $(checkBoxes).each(function (i) {
    $(checkBoxes[i]).prop('checked', false);
  });
  $(thiss).prop('checked', true);
}
function addSingleChoiceNo(rowNumber) {
  $(`button.singleButton[rownumber="${rowNumber}"]`).each(function (i) {
    $(this).find('input[type="checkbox"]').attr('id', 'choiceCheck' + (i + 1));
    $(this).find('input[type="file"]').attr('id', 'openFile' + (i + 1));
    $(this).find('input[type="checkbox"]').attr('data-content', String.fromCharCode(64 + (i + 1)));
    $(this).find('label').attr('id', 'labelText' + (i + 1));
    $(this).find('label').attr('data-placeholder', 'Choice ' + (i + 1));
    $(this).closest('div.singleParent').find('div.singlechoiceinput').attr('id', 'singleInputId' + (i + 1));
    $(this).closest('div.singleParent').find('div.singlechoiceDesc').attr('id', 'singleDescId' + (i + 1));

  });
}
function addValueToRadio(thiss) {
  let labelText = $(thiss).text();
  $(thiss).closest('button.btn-yesorno').find('input.yesnoradio').val(labelText)
}
// var count = 0;
function imageParser(imageName, questionId) {
  // count++;
  let base64 = '';
  // console.info(count, imageName, questionId);
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
        base64 = "data:image/png;base64," + data;
        // $(`img.set-img[id="${questionId}"]`).show();
      }
    })
  }
  return base64;
}
function yesRnoType(objectId, objectIdOrg, quesData) {
  let questionVal = '';
  let answerVal = '';
  let choiceVal = '';
  let imageName = '';
  let imageSrc = '';
  let dNone = '';
  let centerAlign = '';
  let mappedQuestion = '';
  if (quesData) {
    questionVal = (quesData.questionName) ? quesData.questionName : '';
    answerVal = (quesData.questionAnswer) ? quesData.questionAnswer : '';
    choiceVal = (quesData.questionChoice) ? quesData.questionChoice : '';
    imageName = (quesData.questionImage) ? quesData.questionImage : '';
    mappedQuestion = (quesData.mapQuestions) ? quesData.mapQuestions : '';
    if (imageName != '') {
      imageSrc = imageParser(imageName, objectId);
    }
    else {
      dNone = 'd-none';
      centerAlign = 'margin: 0px auto;';
    }
  }
  else {
    choiceVal = 'Yes,No';
    dNone = 'd-none';
    centerAlign = 'margin: 0px auto;';
  }
  let choiceArr = choiceVal.split(',');
  let checkboxVal1 = (choiceArr[0]) ? choiceArr[0].replace(/\#COMMA\#/gm, ',') : '';
  let checkboxVal2 = (choiceArr[1]) ? choiceArr[1].replace(/\#COMMA\#/gm, ',') : '';


  let rowNumber = $(`div[id="${objectId}"]`).find('span.rowNumber').text();
  let submitText = (quesData) ? 'Update' : 'Add';
  let newYesNoLayout = `<div class="yesorn0-type d-flex h-100 yesnoParent form hide" id="${objectId}" originid="${objectIdOrg}">
   <div class="w-50 changePosition ps-5 py-5 pe-4 d-flex align-items-center" style="${centerAlign}">
     <div class="d-flex align-items-start w-100 gap-3 flex-column">
       <div class="set-form-label d-flex w-100 gap-3">
         <span class="mainformRowNumber">${rowNumber}</span>
         <div class="d-flex flex-column w-100">
           <div type="text" class="yesnoinput editable" contenteditable id="yesnoques${rowNumber}" onkeydown="javascript:keyboardFunc(event,this)" onkeyup="javascript:includeAnswerHere(event,this)" data-placeholder="Your Question here" onpaste="javascript:clipboardPaste(event,this);" value="${questionVal}">${questionVal}</div>
         </div>
       </div>
       <div class="d-flex flex-column gap-3">
         <button type="button" class="btn d-flex justify-content-start btn-yesorno ms-4 ps-4 position-relative" >
           <div class="form-check tickRadio">
             <input class="form-check-input flex-shrink-0  yesnoradio" data-content='Y' type="radio" name="flexRadioDefault${rowNumber}" id="flexRadioDefault${rowNumber}" onchange="javascript:this.value = $(this).closest('.form-check').find('p.editable').text();tickAnswer(this);" value="" />
             <label class="form-check-label d-flex justify-content-start align-items-center editable" contenteditable onfocusout="javascript:addValueToRadio(this);" data-placeholder="True" style="position:relative;">${checkboxVal1}<i class="ps-5 bi bi-check-lg tickMark invisible" contenteditable="false"></i>
             </label>
           </div>
         </button>
         <button type="button" class="btn d-flex justify-content-start btn-yesorno ms-4 ps-4 position-relative" >
           <div class="form-check tickRadio">
             <input class="form-check-input flex-shrink-0  yesnoradio" type="radio" data-content='N' name="flexRadioDefault${rowNumber}" id="flexRadioDefault${rowNumber}" onchange="javascript:this.value = $(this).closest('.form-check').find('p.editable').text();tickAnswer(this);" value="" />
             <label class="form-check-label d-flex justify-content-start align-items-center editable" contenteditable onfocusout="javascript:addValueToRadio(this);" data-placeholder="False" style="position:relative;">${checkboxVal2}<i class="ps-5 bi bi-check-lg tickMark invisible" contenteditable="false"></i>
             </label>
           </div>
         </button>
       </div>
       <button type="button" class="btn question-button ms-4 mt-3" objectid="${objectId}" rownumber="${rowNumber}" onclick="saveMainForm(this)">${submitText}</button>
     </div>
   </div>
   <div class="w-50 imageContainer ${dNone}">
   <button class="btn deleteImg" onclick="javascript:deleteImage(this);return false;" data-bs-toggle="tooltip" data-bs-placement="top" title="Remove"><i class="bi bi-trash-fill imgTrash"></i></button>
     <img id=${objectId} name="${imageName}" class="set-img"
       src="${imageSrc}"
       alt="Image Crashed">
   </div>
 </div>
`;
  $('#contentQuesSet').html(newYesNoLayout);
  if (quesData) {
    let radioButtons = $(`div.yesnoParent[id="${objectId}"]`).find('p.editable');
    $(radioButtons).each(function (i) {
      if ($(radioButtons[i]).text() == answerVal.replace(/\#COMMA\#/gm, ',')) {
        $(radioButtons[i]).closest('div.tickRadio').find('input[type=radio]').attr('checked', true);
        $(radioButtons[i]).closest('div.tickRadio').find('input[type=radio]').change();
      }
    });
  }
  if (mappedQuestion && mappedQuestion != '') {
    unParseSelect(objectId);
  }
}
function tickAnswer(thiss) {
  let inputCheck = $(thiss).closest('div.tickRadio');
  $('i.tickMark').addClass('invisible');
  if ($(thiss).is(':checked')) {
    $(inputCheck).find('i.tickMark').removeClass('invisible');
  }
}
function onlyNumbers(e) {
  // console.log(event.code)
  if (
    event.code.includes('Digit') || event.code.includes('Numpad') || event.code.includes('Arrow') ||
    event.code === 'Backspace' ||
    event.code === 'Period'
  ) {
    // console.log(e)
  } else {
    event.preventDefault()
  }
}
function numberType(objectId, objectIdOrg, quesData) {
  let questionVal = '';
  let answerVal = '';
  let imageName = '';
  let imageSrc = '';
  let dNone = '';
  let centerAlign = '';
  let mappedQuestion = '';
  if (quesData) {
    questionVal = (quesData.questionName) ? quesData.questionName : '';
    answerVal = (quesData.questionAnswer) ? quesData.questionAnswer : '';
    imageName = (quesData.questionImage) ? quesData.questionImage : '';
    mappedQuestion = (quesData.mapQuestions) ? quesData.mapQuestions : '';
    if (imageName != '') {
      imageSrc = imageParser(imageName, objectId);
    }
    else {
      dNone = 'd-none';
      centerAlign = 'margin: 0px auto;';
    }
  }
  else {
    dNone = 'd-none';
    centerAlign = 'margin: 0px auto;';
  }
  let rowNumber = $(`div[id="${objectId}"]`).find('span.rowNumber').text();
  let submitText = (quesData) ? 'Update' : 'Add';
  let numberTypeLayout = `<div class="number-type d-flex h-100 numberTypeParent form hide" id="${objectId}" originid="${objectIdOrg}">
    <div class="w-50 changePosition px-5 py-5  d-flex align-items-center" style="${centerAlign}">
      <div class="d-flex align-items-start w-100 gap-3 flex-column">
        <div class="set-form-label w-100 d-flex gap-4">
        <span class="mainformRowNumber">${rowNumber}</span>
          <div class="d-flex w-100 align-items-start flex-column pe-4">
            <div type="text" class="numberQuestion w-100 editable" contenteditable id="numberQuestion${rowNumber}" onkeydown="javascript:keyboardFunc(event,this)" onkeyup="javascript:includeAnswerHere(event,this)" data-placeholder="Your Question here" onpaste="javascript:clipboardPaste(event,this);" value="${questionVal}">${questionVal}</div>
            <div class="input-answer my-5 py-2 numberAnswer w-75 editable" type="answer" contenteditable id="numberAnswer${rowNumber}" data-placeholder="Type your answer here..." onkeydown="javascript:onlyNumbers(event)" onpaste="javascript:clipboardPaste(event,this);" value="${answerVal}">${answerVal}</div>
            <button type="button" class="btn question-button" objectid="${objectId}" rownumber="${rowNumber}" onclick="saveMainForm(this)" style="padding:10px 20px !important;">${submitText}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="w-50 imageContainer ${dNone}">
    <button class="btn deleteImg" onclick="javascript:deleteImage(this);return false;" data-bs-toggle="tooltip" data-bs-placement="top" title="Remove"><i class="bi bi-trash-fill imgTrash"></i></button>
      <img id=${objectId} name="${imageName}" class="set-img"
        src="${imageSrc}"
        alt="Image Crashed">
    </div>
  </div>
`;
  $('#contentQuesSet').html(numberTypeLayout)
  if (mappedQuestion && mappedQuestion != '') {
    unParseSelect(objectId);
  }
}
function textType(objectId, objectIdOrg, quesData) {
  let questionVal = '';
  let answerVal = '';
  let imageName = '';
  let imageSrc = '';
  let dNone = '';
  let centerAlign = '';
  let mappedQuestion = '';
  if (quesData) {
    questionVal = (quesData.questionName) ? quesData.questionName : '';
    answerVal = (quesData.questionAnswer) ? quesData.questionAnswer : '';
    imageName = (quesData.questionImage) ? quesData.questionImage : '';
    mappedQuestion = (quesData.mapQuestions) ? quesData.mapQuestions : '';
    if (imageName != '') {
      imageSrc = imageParser(imageName, objectId);
    }
    else {
      dNone = 'd-none';
      centerAlign = 'margin: 0px auto;';
    }
  }
  else {
    dNone = 'd-none';
    centerAlign = 'margin: 0px auto;';
  }
  let rowNumber = $(`div[id="${objectId}"]`).find('span.rowNumber').text();
  let submitText = (quesData) ? 'Update' : 'Add';
  let textTypeLayout = `<div class="number-type text-type d-flex h-100 textTypeParent form hide" id="${objectId}" originid="${objectIdOrg}">
    <div class="w-50 changePosition px-5 py-5  d-flex align-items-center" style="${centerAlign}">
      <div class="d-flex align-items-start gap-3 w-100 flex-column">
        <div class="set-form-label w-100 d-flex gap-4">
         <span class="mainformRowNumber">${rowNumber}</span>
          <div class="d-flex align-items-start w-100 flex-column">

            <div type="text" class="textQuestion w-100 editable" contenteditable id="textQuestion${rowNumber}" onkeydown="javascript:keyboardFunc(event,this)" onkeyup="javascript:includeAnswerHere(event,this)" data-placeholder="Your Question here" onpaste="javascript:clipboardPaste(event,this);" value="${questionVal}">${questionVal}</div>

            <div class="input-answer my-5 py-2 textAnswer w-75 editable" contenteditable type="answer" id="textAnswer${rowNumber}" onpaste="javascript:clipboardPaste(event,this);" data-placeholder="Type your answer here..." value="${answerVal}">${answerVal}</div>
            <button type="button" class="btn question-button" objectid="${objectId}" rownumber="${rowNumber}" onclick="saveMainForm(this)" style="padding:10px 20px !important;">${submitText}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="w-50 imageContainer ${dNone}">
    <div class="download">
    <i class="bi bi-download"></i> download
    </div>
    <button class="btn deleteImg" onclick="javascript:deleteImage(this);return false;" data-bs-toggle="tooltip" data-bs-placement="top" title="Remove"><i class="bi bi-trash-fill imgTrash"></i></button>
      <img id=${objectId} name="${imageName}" class="set-img"
        src="${imageSrc}"
        alt="Image Crashed">
    </div>
  </div>
`;
  $('#contentQuesSet').html(textTypeLayout);
  if (mappedQuestion && mappedQuestion != '') {
    unParseSelect(objectId);
  }

}
function unParseSelect(questionId) {
  let divParent = $('#contentQuesSet');
  // debugger;
  let divText = $(divParent).find('div[type="text"]').html().replace(/\s\s+/g, ' ').trim();
  let thiss = $(divParent).find('div[type="text"]');
  // let indexOfAt = str.indexOf("##SELECTTAG##");
  createHashSelect(divText, questionId, thiss);
  // let selectElem = '<div class="editable mapQuestion mb-2 selectControl" contenteditable data-placeholder="...">'+str.slice(0, indexOfAt) + `
  // <div class="select d-flex mx-1 selectControl" mapquestionid="">

  //   <select class="form-select form-select-sm includeAnswer" onchange="javascript:$(this).closest('.select').find('div.atStyle').remove();addSelectValue(this,'${questionId}')" id="includeAnswer${mapCount}" aria-label="Default select example">
  //   </select>
  // </div>` +'</div>'+ '<div class="editable mapQuestion mb-2 selectControl" contenteditable data-placeholder="...">'+str.slice(indexOfAt + 1)+'</div>';
  // selectElem = selectElem.replace(/##SELECTTAG##/s,'');
  // $(divParent).find('div[type="text"]').html(selectElem)
}
function createHashSelect(divText, questionId, thiss) {
  // console.info(divText);
  let mapCount = '';
  let splitText = divText.split('##SELECTTAG##');
  let orderId = Number($(thiss).closest('div.form').find('span.mainformRowNumber').text());
  $(thiss).closest('div.form').find('div[type="text"]').attr('contenteditable', false);
  let selectTag = '';
  for (d in splitText) {
    // mapCount = $('select.includeAnswer').length+1;
    // console.info(splitText[d]);
    if (Number(d) + 1 != splitText.length) {
      // console.info("if");
      mapCount++;
      selectTag += '<div class="editable mapQuestion mb-2 selectControl" contenteditable onkeydown="javascript:keyboardFunc(event,this);" data-focus-visible data-placeholder="Type..">' + splitText[d] + `
    <div class="select d-flex mx-1 selectControl" contenteditable="false" mapquestionid="" orderid="${orderId}" style="position:relative;">
    <i class="bi bi-x-circle-fill selectClose" selectorder=${mapCount} onclick="javascript:deleteSelectOption(this,'${questionId}')"></i>
      <select class="includeAnswer" onchange="javascript:$(this).closest('.select').find('div.atStyle').remove();addSelectValue(this,'${questionId}')" id="includeAnswer${mapCount}" aria-label="Default select example">
      </select>
    </div>` + '</div>';
    }
    else if (Number(d) + 1 == splitText.length && splitText[d] != '') {
      // console.info("else if 1");
      mapCount++;
      selectTag += '<div class="editable mapQuestion mb-2 selectControl" contenteditable onkeydown="javascript:keyboardFunc(event,this);" data-focus-visible data-placeholder="Type..">' + splitText[d] + `
    <div class="select d-flex mx-1 selectControl" contenteditable="false" mapquestionid="" orderid="${orderId}" style="position:relative;">
    <i class="bi bi-x-circle-fill selectClose" selectorder=${mapCount} onclick="javascript:deleteSelectOption(this,'${questionId}')"></i>
      <select class="includeAnswer" onchange="javascript:$(this).closest('.select').find('div.atStyle').remove();addSelectValue(this,'${questionId}')" id="includeAnswer${mapCount}" aria-label="Default select example">
      </select>
    </div>` + '</div>';
    }
    else {
      // console.info("else");
      selectTag += '<div class="editable mapQuestion mb-2 selectControl" contenteditable onkeydown="javascript:keyboardFunc(event,this);" data-focus-visible data-placeholder="..">' + splitText[d] + '</div>';
    }
    // console.info(Number(d)+1+'__'+splitText.length);
  }
  $(thiss).html(selectTag);

  $.ajax({
    type: "post",
    url: serverKey + "mapquestion",
    async: false,
    data: JSON.stringify({
      questionsetid: uniqueKey,
      questionid: questionId,
      orderid: orderId
    }),
    contentType: "application/json; charset=utf-8",
    success: function (html) {
      let data = html?.data;
      // console.info(data);
      for (var t = 1; t <= mapCount; t++) {
        let optionArr = [];
        for (x in data) {
          let newOption = `<option id="${data[x]._id}" value="${(data[x].questionname).replace(/##SELECTTAG##/gm, '')}">${Number(x) + 1}. ${(data[x].questionname).replace(/##SELECTTAG##/gm, '')}</option>`;
          optionArr.push(newOption);
        }
        let parsedOption = optionArr.join('')
        $(`#includeAnswer${t}`).html('<option data-display="Select" value="0">Select Question</option>' + parsedOption);
        $('select').niceSelect();
        let mapQues = $(`div.rowActive[id=${questionId}]`).attr('mappedquestion');
        // let mapSelect = $('select.inclueAnswer');
        if (mapQues != '') {
          let mappedquestion = mapQues.split(',');
          for (y in mappedquestion) {
            // console.info(y+'='+mappedquestion[y]);
            $(`#includeAnswer${Number(y) + 1}` + ' option[id="' + mappedquestion[y] + '"]').prop('selected', true);
            $('select').niceSelect('update');
          }
        }
      }
    }
  });
}
function deleteSelectOption(thiss, question) {
  let questionId = question;
  let selectOrder = $(thiss).attr('selectorder');
  let parentSelect = $(thiss).closest('div.selectControl');
  let selectedValue = $(parentSelect).find('select.includeAnswer option:selected').val();
  if (selectedValue == '0') {
    let thisParent = $(thiss).closest('div.mapQuestion');
    $(thiss).closest('div.select').remove();
    let text = $(thisParent).text().trim();
    let overrideText = text + '@';
    $(thisParent).text(overrideText);
  }
  else {
    $(thiss).closest('div.select').remove();
    let mapQues = $(`div.ui-state-default[id=${questionId}]`).attr('mappedquestion');
    if (mapQues != '') {
      let mappedquestion = mapQues.split(',');
      let index = selectOrder - 1;
      if (index > -1) {
        mappedquestion.splice(index, 1);
      }
      let mapQuestions = mappedquestion.join(',');
      // console.info(mapQuestions);
      // console.info(mapQues);
      $(`div.ui-state-default[id=${questionId}]`).attr('mappedquestion', mapQuestions);

    }
  }
  console.info(selectedValue);
}
function imageChange(thiss) {
  let image = $(thiss).find('img.set-img').attr('src');
  if (image) {
    $('.set-img').show();
    $('.deleteImg').show();
    $('.imageContainer').removeClass('d-none');
  }
  else {
    $('.set-img').hide();
    $('.deleteImg').hide();
    $('.imageContainer').addClass('d-none');
    $(thiss).closest('div.form').find('div.changePosition').css('margin', '0px auto');
  }
}
function deleteImageName(questionId) {
  $.ajax({
    type: "post",
    url: serverKey + "storequestion",
    async: false,
    data: JSON.stringify({
      questionid: questionId,
      qnDescImage: '',
    }),
    contentType: "application/json; charset=utf-8",
    traditional: true,
    success: function (data) { }
  });
}
function deleteImage(thiss) {
  let imageName = $(thiss).closest('.imageContainer').find('img').attr('name');
  let questionId = $(thiss).closest('div#contentQuesSet').find('div.form').attr('id');
  $(thiss).closest('.imageContainer').find('img').attr('src', '');
  $(thiss).closest('.imageContainer').find('img').attr('name', '');
  imageChange(thiss);
  $("input#formFile").val('');
  $("input#formFile").change();
  $.ajax({
    type: "DELETE",
    url: serverKey + "deleteimage?imagename=" + imageName,
    async: false,
    contentType: "application/json; charset=utf-8",
    success: function (data) {
      deleteImageName(questionId);
    }
  });
}
// Vijay End

// Sagunthala Start
//popup
$(document).on('click', '#popupbtn', function () {
  //logic get Cal
  $('#questionPopupList').empty();
  apiurl = serverKey + "getlogic?questionsetid=" + uniqueKey;
  $.ajax({
    type: "GET",
    url: apiurl,
    success: function (html) {
      var datavalue = html?.data;
      var getlogic = datavalue?.logic;
      $('#logicQuestion').val(JSON.stringify(getlogic));
      //question getcal
      let addy = serverKey + "getquestion?questionsetid=" + uniqueKey
      // console.log(addy);
      $.ajax({
        type: "GET",
        url: addy,
        success: function (html) {
          var dataques = html?.data;
          var duplicateData = html?.data;
          // console.log(duplicateData);
          var option;
          var qId = [];
          $('#allQuestion').val(dataques.length);
          let allData = $('#allQuestion').val();
          for (var i = 0; i < allData; i++) {
            qId.push(dataques[i].questiontypeid);
          }

          for (var val in dataques) {
            option = '';
            for (var val1 in duplicateData) {
              if (dataques[val].questionname != duplicateData[val1].questionname) {
                option += `<option id='selValue' value=${duplicateData[val1]._id}>${(duplicateData[val1].questionname).replace(/##SELECTTAG##/gm, '')}</option>`;
              }
            }
            if (dataques.hasOwnProperty(val)) {
              dataques[val].questionname;
              var selectedAllChoice = '';
              var choiceoption = '';

              if (dataques[val].questiontypeid == '63e0908a88ad9227fbe1cf6d') {
                for (y of dataques[val].choice) {
                  // console.log(y);
                  choiceoption += `<option id='selValue' value="${y}">${y}</option>`;
                }
                selectedAllChoice = `<select class='form-select choice1' id='choice'>  <option value="">Select</option> ${choiceoption.replace(/\#COMMA\#/gm, ',')}</select>`;
              }
              else if (dataques[val].questiontypeid == '63e0909488ad9227fbe1cf71') {
                for (y of dataques[val].choice) {
                  choiceoption += `<option id='selValue' value="${y}">${y}</option>`;
                }
                selectedAllChoice = `<select class='form-select choice1' id='choice'> <option value="">Select</option>  ${choiceoption.replace(/\#COMMA\#/gm, ',')}</select>`;
              }
              else if (dataques[val].questiontypeid == '63e090fa88ad9227fbe1cf9f') {

                selectedAllChoice = `<input type="text" class="form-control number" name="number" id="number" value="" placeholder="Type here"></input>`;
              }
              else if (dataques[val].questiontypeid == '63e0f69e88ad9227fbe206d9') {
                selectedAllChoice = `<input type="text" class="form-control text" name="text" id="text" value="" placeholder="Type here"></input>`;
              }
              else if (dataques[val].questiontypeid == '63ecb6fa814d072deeca3ad5') {
                for (y of dataques[val].choice) {
                  choiceoption += `<option id='selValue' value="${y}">${y}</option>`;
                }
                selectedAllChoice = `<select class='form-select choice1' id='choice'> <option value="" >Select</option> ${choiceoption.replace(/\#COMMA\#/gm, ',')}</select>`;
              }

              $('#questionPopupList').append(`
              <div class="question-logic-row" data-id="${dataques[val]._id}">
                    <h5 dataid="${dataques[val].questionname}">${Number(val) + 1}. ${(dataques[val].questionname).replace(/##SELECTTAG##/gm, '')}</h5>
                             
                    <div class="row g-4 displaynone${val} displaynone" id="logicId${val}">
                      <div class="col-md-2">
                        <select id="inputStateIf" class="form-select">
                          <option selected>if</option>
                          <option>...</option>
                        </select>
                      </div>
                      <input type="hidden" id="questionTypeIdSelect" name="questionTypeIdSelect"  value="${dataques[val].questiontypeid}">
                      <div class="col-md-10">
                        <select id="inputStateQuestion" class="form-select">
                        <option>Select</option>
                          <option selected value=${dataques[val]._id}>${dataques[val].questionname}</option>
                          <option>...</option>
                        </select>
                      </div>
                      <div class="col-md-10 offset-md-2">
                        <div class="row ">
                          <div class="col-md-4 ">
                            <select id="inputStateCondition" class="form-select">  
                            <option value="">Select</option>                         
                              <option  value="isnotequalto">is not equal to</option> 
                              <option value="isequalto">is equal to</option>
                            </select>
                          </div>
                          <div class="col-md-8 ">
                         ${selectedAllChoice}
                          </div>
                        </div>
                      </div>
                      <div class="col-md-2 d-flex align-items-center">
                        <label for="inputEmail4" class="form-label m-0 ">Then</label>
                      </div>
                      <div class="col-md-3 ">
                        <select id="inputState" class="form-select">
                          <option selected>go to</option>
                          <option>...</option>
                        </select>
                      </div>
                      <div class="col-md-7 ">
                      <select  class="form-select mySelectionBox" id="mySelectionBoxid">
                      <option value="">Select</option>
                      ${option}
                      </select>
                      </div>                   
                    </div>

                    <div class="action-btn d-flex justify-content-between mt-3">
                    <button type="button" class="btn success-color btn-link p-0 addrule" id="addRule${val}" onclick="javascript:addRule(${val})">+ Add rule</button>
                    <button type="button" class="btn danger-color btn-link p-0 addrule" onclick="javascript:deleteRule(${val},this)">Delete this rule</button>
                  </div>
                  </div>
                 `)

              //compare

              for (doc in getlogic) {

                if (getlogic[doc].questionid == dataques[val]._id) {
                  // console.log(getlogic[doc].questionid);
                  // console.log(dataques[val]._id);
                  $(`#logicId` + val).find('input:text[name=text]').val(getlogic[doc].statement);
                  $(`#logicId` + val).find('input:text[name=number]').val(getlogic[doc].statement);
                  $(`#logicId` + val).find(".choice1 option").each(function () {
                    if ($(this).text() == getlogic[doc].statement)
                      $(this).attr("selected", "selected");
                  });
                  $(`#logicId` + val).find('#inputStateCondition  option').each(function () {
                    if ($(this).val() == getlogic[doc].condition)
                      $(this).attr("selected", "selected");
                  });
                  $(`#logicId` + val).find('#mySelectionBoxid  option').each(function () {
                    if ($(this).val() == getlogic[doc].goto_questionid)
                      $(this).attr("selected", "selected");
                  });
                  if (getlogic[doc].statement != null) {
                    var element = document.getElementById("logicId" + val);
                    element.classList.remove("displaynone");
                    // element.classList.add("displayblock");
                    $("logicId" + val).addClass("displayblock");
                  }
                  else {
                    var element1 = document.getElementById("logicId" + val);
                    element1.classList.remove("displayblock");
                    element1.classList.add("displaynone");
                  }
                }

              }
              //end
            }

          }

        }
      })
    }
  });
})

$(document).on('click', '#save', function (e) {
  e.preventDefault();
  let slectedQuestion;
  let allData = $('#allQuestion').val();
  let answer;
  let dataLogic = [];
  for (var i = 0; i < allData; i++) {

    slectedQuestion = $(`#logicId${i}`).find("#inputStateQuestion").children("option").filter(":selected").val();
    // let answer = $(`#logicId${i}`).find("#choice").children("option").filter(":selected").val();
    let gotoQuestion = $(`#logicId${i}`).find("#mySelectionBoxid").children("option").filter(":selected").val();
    let condition = $(`#logicId${i}`).find("#inputStateCondition").children("option").filter(":selected").val();

    if ($(`#logicId${i}`).find('#questionTypeIdSelect').val() == '63e0908a88ad9227fbe1cf6d') {
      answer = $(`#logicId${i}`).find("#choice").children("option").filter(":selected").val();
    }
    else if ($(`#logicId${i}`).find('#questionTypeIdSelect').val() == '63e0909488ad9227fbe1cf71') {
      answer = $(`#logicId${i}`).find("#choice").children("option").filter(":selected").val();
    }
    else if ($(`#logicId${i}`).find('#questionTypeIdSelect').val() == '63e090fa88ad9227fbe1cf9f') {
      answer = $(`#logicId${i}`).find('#number').val();
      // console.log(answer)
    }
    else if ($(`#logicId${i}`).find('#questionTypeIdSelect').val() == '63e0f69e88ad9227fbe206d9') {
      answer = $(`#logicId${i}`).find('#text').val();
      // console.log(answer)
    }
    else if ($(`#logicId${i}`).find('#questionTypeIdSelect').val() == '63ecb6fa814d072deeca3ad5') {
      answer = $(`#logicId${i}`).find("#choice").children("option").filter(":selected").val();
    }
    // if (answer && answer != '') {
    dataLogic.push({ questionid: slectedQuestion, condition: condition, statement: answer, goto_questionid: gotoQuestion });
    // }

  }
  // console.log(dataLogic);
  let apiurl = serverKey + "logic";
  let data = {
    questionsetid: uniqueKey,
    logic: dataLogic,
  }
  $.ajax({
    url: apiurl,
    type: 'POST',
    dataType: 'json',
    data: data,
    success: function (d) {
      // console.log(d);
      $('#branchingCalculation').modal('hide');
    },
    error: function () {
      alert("Error please try again");
    }
  });

})


function addRule(i) {
  // console.log(i);
  var element = document.getElementById("logicId" + i);
  element.classList.remove("displaynone");
  $("logicId" + i).addClass("displayblock");
  var element1 = document.getElementById("addRule" + i);
  element1.classList.remove("displayblock");
  element1.classList.add("displaynone");
}
function deleteRule(i, thiss) {
  let logicData = $('#logicQuestion').val();
  console.log(JSON.parse(logicData));
  let logicDataArray = JSON.parse(logicData);
  var qid = $(thiss).closest('div.question-logic-row').attr('data-id');
  console.log(qid);
  for (doc in logicDataArray) {
    console.log(logicDataArray[doc].questionid)
    if (logicDataArray[doc].questionid == qid) {
      console.log(logicDataArray[doc].questionid);
      console.log(qid);
      logicDataArray.splice(doc, 1)
    }
  }
  console.log(logicDataArray);
  let sendInfo = {
    questionsetid: uniqueKey,
    questionid: qid,
    logic: logicDataArray
  }
  $.ajax({
    url: serverKey + "logic",
    type: 'POST',
    dataType: 'json',
    data: sendInfo,
    success: function (d) {
    },
  });

  var element = document.getElementById("logicId" + i);
  element.classList.remove("displayblock");
  element.classList.add("displaynone");
  var element1 = document.getElementById("addRule" + i);
  element1.classList.remove("displaynone");
  element1.classList.add("displayblock");
}
function getLogic() {
  let apiUrl = serverKey + "getlogic?questionsetid=" + uniqueKey;
  $.ajax({
    type: "GET",
    url: apiUrl,
    async: false,
    success: function (html) {
      var datavalue = html?.data;
      // console.log(datavalue);
    }
  });
  return datavalue;
}

//option Inage Upload
function optionImage(thisss) {
  console.log(thisss);
  let objectId = $(thisss).attr('id');
  console.log(objectId);
  let file = document.querySelector("input#" + objectId).files[0];
  console.log(file);
  if (file) {
    if (file.size >= 1 && file.size <= 2000000) { //Image should be > 2mb (2000000 bytes)       
      let questionId = $('div#contentQuesSet').find('.form').attr('id');
      let blob = new Blob([file], { type: file.type });
      let url = URL.createObjectURL(blob);
      console.log(url);
      let reader = new FileReader();
      reader.onload = (e) => {
        let image = e.target.result;
        console.log(image);
        let optionImageUniqueKey = new Date().getTime().toString(36);
        let optionImageName = '';
        const formData = new FormData();
        let fileBaseType = '' + file.type;
        let fileType = fileBaseType.split('/')[1];
        let myRenamedFile = new File([file], optionImageUniqueKey + '.' + fileType);
        formData.append('file', myRenamedFile);
        console.log(formData);
        optionImageName = myRenamedFile.name;
        //  $(this).attr('name',optionImageName);    
        uploadFile(formData);

        // if (optionImageName != '') {
        //   imageSrc = imageParser(optionImageName,objectId);
        $(`img.set-imgchoice[id="${objectId}"]`).attr('src', image);
        $(`img.set-imgchoice[id="${objectId}"]`).attr('name', optionImageName);

        $(`img.set-imgchoice[id="${objectId}"]`).show();

        // }
        // $(`img.set-imgchoice[id="${objectId}"]`).attr('src', image);
        // $(`img.set-imgchoice[id="${objectId}"]`).show();
      };
      reader.readAsDataURL(file);


    }
  }
}
//option image delete

function deleteOptionImageName(questionId) {

  $.ajax({
    type: "post",
    url: serverKey + "storequestion",
    async: false,
    data: JSON.stringify({
      questionid: questionId,
      // choice: '',
    }),
    contentType: "application/json; charset=utf-8",
    traditional: true,
    success: function (data) { }
  });
}
function deleteOptionImage(thiss) {
  let choice;
  choice = $(thiss).closest('button.singleButton').attr('choice');
  console.log(choice);
  let imageName = $(thiss).closest('button.singleButton').find('img').attr('name');
  console.log(choice.imgName);
  if (choice.imgName == imageName) {
    choice[imgName] = '';
    console.log(choice);
  }
  let questionId = $(thiss).closest('div#contentQuesSet').find('div.form').attr('id');
  console.log(questionId);
  $(thiss).closest('button.singleButton').find('img').attr('src', '');
  $(thiss).closest('button.singleButton').find('img').attr('name', '');
  $.ajax({
    type: "DELETE",
    url: serverKey + "deleteimage?imagename=" + imageName,
    async: false,
    contentType: "application/json; charset=utf-8",
    success: function (data) {
      // deleteOptionImageName(questionId);
    }
  });
}


//option image end
//end
/***** Sagunthala End********/



