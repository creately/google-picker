# Google picker

https://developers.google.com/picker/docs/index

```
import * as GP from '@creately/google-picker';

    const googlePicker = GP({
        clientId: '',
        developerKey: '',
        appId: '',
        onpick: data => {
            console.log( 'selected files data', data );
        },
    });

    googlePicker.then( picker => {
        // Show picker
        picker();
    });
```