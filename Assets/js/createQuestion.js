const serverKey = "http://192.168.0.45:8001/api/"
$(document).ready(function () {
    $("#postform").submit(function (e) {
      e.preventDefault();
      var apiurl = serverKey+"questionset";
      var data = {
        questionsetname: $("#Questionsetname").val(),

      }
      if (data.questionsetname.length == '') {
        $('#Questionsetname').after('<span class="text-danger">This field is required</span>');
      }
      $.ajax({
        url: apiurl,
        type: 'POST',
        dataType: 'json',
        data: data,
        success: function (d) {
          document.getElementById("postform").reset();
          location.reload();
        },
        error: function () {
          alert("Error please try again");
        }
      });
    });
  });

  $(document).ready(function () {
    $.ajax({
      type: "GET",
      url: serverKey+"getquestionset",
      cache: false,

      success: function (html) {
        var datavalue = html?.data;
        console.log(datavalue);

        for (var val in datavalue) {
          if (datavalue.hasOwnProperty(val)) {

            $('#assessmentName').append(` 
<div class='col-3 d-flex justify-content-center align-items-center mt-5'>
<div class="card text-center cardwidth">
<button type='button' class='btn p-0 mt-3'  id='assbtn'>
<div class="card-body">   
  <h3 data-id= '${datavalue[val]._id}' ></h3>
  <h5 class="card-title">${datavalue[val].questionsetname}</h5>   
</div>
</button>
<div class="card-footer p-0 pe-2  verticle-m text-muted cardfooter">
  <p data-bs-toggle="dropdown" aria-expanded="false" class='floatend font16 cursor '>...

<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
  <li data-id= '${datavalue[val]._id}' id='getid'><a class="dropdown-item" href="#">Delete</a></li>   
</ul> 
</p>
</div>
</div>
</div>

`)
          }
        }

      }

    });
    $(document).on('click', '#assbtn', function () {

      var id = $(this).find('h3').attr('data-id')
      console.log(id);
      window.location = './dashboard.html?id=' + id;

    });


    $(document).on('click', '#getid', function () {
      var id = $(this).attr('data-id');
      console.log(id);
      let addy = serverKey+"deletequestionset?questionsetid=" + id
      console.log(addy);
      $.ajax({
        type: "DELETE",
        url: addy,
        success: function (html) {
          var dataques = html?.data;
          console.log(dataques);
          window.location.reload();
        }
      })
    })
  });
