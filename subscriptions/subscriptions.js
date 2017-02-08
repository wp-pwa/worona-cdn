/* eslint-disable */
function getQueryByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(function() {
  var apiUrls = {
    'subscriptions.worona.org': 'https://backend.worona.io',
    'presubscriptions.worona.org': 'https://prebackend.worona.io',
    'local': 'http://localhost:4500',
  }
  var apiEnvs = {
    'subscriptions.worona.org': 'prod',
    'local': 'dev',
  }
  var host = window.location.host;
  var apiUrl = apiUrls[host] || apiUrls.local;
  var apiEnv = apiEnvs[host] || apiEnvs.local;
  var email = getQueryByName('email');
  var listSlug = getQueryByName('listSlug');
  var listName = getQueryByName('listName');
  try {
    if (!email || !listSlug) throw '\
      <h2>\
        <a class="button is-white"><span class="icon is-medium"><i class="fa fa-times"></i></span></a>\
        There was a problem unsubscribing please \
        <a href="https://www.worona.org/get-help" target="_blank">contact support@worona.org</a>.\
      </h2>';

    // Show loading screen.
    $('#dynamic').html('\
      <h2>\
        <span class="button is-loading is-white"></span>\
        &nbsp;&nbsp;Unsubscribing <strong>' + email + '</strong> from\
        <strong>' + listSlug + '</strong> email list.\
      </h2>'
    );

    var request = $.ajax({
      type: 'post',
      url: apiUrl + '/api/v1/subscriptions/mixpanel/' + apiEnv + '/unsubscribe',
      data: { email: email, listSlug: listSlug },
      timeout: 10000,
    });

    request.done(function (response){
      $('#dynamic').html('\
        <h2>\
          <a class="button is-white"><span class="icon is-medium"><i class="fa fa-check"></i></span></a>\
          &nbsp;&nbsp;Unsubscribed <strong>' + email + '</strong> from \
          <strong>' + response.listName + ' (' + listSlug + ')</strong> email list.\
        </h2>\
        <h5><em>Please be aware that you may still be subscribed to other Worona lists.</em></h5>\
      ');
    });

    request.fail(function (jqXHR, textStatus, error){
      $('#dynamic').html('\
        <h2>\
          <a class="button is-white"><span class="icon is-medium"><i class="fa fa-times"></i></span></a>\
          There was a problem unsubscribing <strong>' + email + '</strong> please \
          <a href="https://www.worona.org/get-help" target="_blank">contact support@worona.org</a>.\
        </h2>'
      );
    });
  } catch (error) {
    $('#dynamic').html(error);
  }
});
