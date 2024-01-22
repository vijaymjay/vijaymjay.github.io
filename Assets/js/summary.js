const serverKey = "http://192.168.0.45:8001/api/"
let parameterId = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  const qSetid = parameterId.id;
  const uniqueid = parameterId.unique;

apiurl = serverKey + "summary?questionsetid=" + qSetid +'&unique=' + uniqueid;
$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: apiurl,
        success: function (html) {
let summaryValue = html.data;

for (var val in summaryValue) {
            $('#summaryList').append(`
            <div class="row align-items-center mb-5">
            <div class="col-md-6">
              <div class="d-flex align-items-center gap-4">
                <h3>${Number(val) + 1}.</h3>
                <h5> ${summaryValue[val].question}</h5>
              </div>
            </div>
            <div class="col-md-4 summary-answers">
              <button type="button" class="btn">
                <label class="form-check-label editable" id="labelText1" contenteditable="" data-placeholder="Choice 1"
                  style="position:relative;top:2.8px;">${summaryValue[val].answer}</label>
              </button>
            </div>
          </div>
            `)
}
        }
    });


    var options = {
      title: {
        text: "Website Traffic Source"
      },
      data: [{
          type: "pie",
          startAngle: 45,
          showInLegend: "true",
          legendText: "{label}",
          indexLabel: "{label} ({y})",
          yValueFormatString:"#,##0.#"%"",
          dataPoints: [
            { label: "Organic", y: 36 },
            { label: "Email Marketing", y: 31 },
            { label: "Referrals", y: 7 },
            { label: "Twitter", y: 7 },
            { label: "Facebook", y: 6 },
            { label: "Google", y: 10 },
            { label: "Others", y: 3 }
          ]
      }]
    };
    $("#chartContainer").CanvasJSChart(options);
});