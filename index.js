module.exports = function picker(config) {
    return new Promise(( resolve, reject ) => {
  
      var developerKey = config.developerKey;
  
      // The Client ID obtained from the Google API Console. Replace with your own Client ID.
      var clientId = config.clientId;
  
      // Replace with your own project number from console.developers.google.com.
      // See "Project number" under "IAM & Admin" > "Settings"
      var appId = config.appId;
  
      // Scope to use to access user's Drive items.
      var scope = config.scope || ['https://www.googleapis.com/auth/drive.file'];
  
      var mimeTypes = config.mimeTypes || "";
  
      var pickerApiLoaded = false;
      var oauthToken;

      // Use the Google API Loader script to load the google.picker script.
      var loadPicker =  function() {
        gapi.load('auth', {'callback': onAuthApiLoad});
        gapi.load('picker', {'callback': onPickerApiLoad});
      }

      loadPickerAPIScript();
  
      function loadPickerAPIScript() {
          const src = `https://apis.google.com/js/api.js?key=${developerKey}`;
          let script = document.body.querySelector( `script[src="${src}"]` );
          if ( script ) {
            resolve( loadPicker );
          } else {
            script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.defer = true;
            script.onload = () => {
              resolve( loadPicker );
            };
            script.onerror = reject;
            document.body.appendChild( script );
          }
      }
  
      function onAuthApiLoad() {
          window.gapi.auth.authorize(
          {
              'client_id': clientId,
              'scope': scope,
              'immediate': false
          },
          handleAuthResult );
      }
  
      function onPickerApiLoad() {
          pickerApiLoaded = true;
          createPicker();
      }
  
      function handleAuthResult(authResult) {
          if (authResult && !authResult.error) {
              oauthToken = authResult.access_token;
              createPicker();
          }
      }
  
      // Create and render a Picker object for searching images.
      function createPicker() {
          if(this.picker) {
            this.picker.setVisible(true);
          } else if (pickerApiLoaded && oauthToken) {
              var view = new google.picker.View(google.picker.ViewId.DOCS);
              view.setMimeTypes(mimeTypes);
              var picker = new google.picker.PickerBuilder()
                  .enableFeature(google.picker.Feature.NAV_HIDDEN)
                  .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
                  .setAppId(appId)
                  .setOAuthToken(oauthToken)
                  .addView(view)
                  .addView(new google.picker.DocsUploadView())
                  .setDeveloperKey(developerKey)
                  .setCallback(pickerCallback)
                  .build();
              picker.setVisible(true);
              this.picker = picker;
          }
      }
  
      function pickerCallback(data) {
          if (data.action == google.picker.Action.PICKED) {
              config.onpick( data );
          }
      }
  
    })
  };