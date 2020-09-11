export const emailTemplate = ({
  actionLabel,
  actionUrl,
  blockOneText = '',
  blockTwoText = '',
  blockThreeText = ''
}: {
  actionLabel: string;
  actionUrl: string;
  blockOneText?: string;
  blockTwoText?: string;
  blockThreeText?: string;
}) => `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<!--[if gte mso 9]>
<xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
</xml>
<![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
  <title></title>
  
    <style type="text/css">
      a { color: #0000ee; text-decoration: underline; }
body {
  margin: 0;
  padding: 0;
}

table,
tr,
td {
  vertical-align: top;
  border-collapse: collapse;
}

p,
ul {
  margin: 0;
}

.ie-container table,
.mso-container table {
  table-layout: fixed;
}

* {
  line-height: inherit;
}

a[x-apple-data-detectors='true'] {
  color: inherit !important;
  text-decoration: none !important;
}

.ExternalClass,
.ExternalClass p,
.ExternalClass span,
.ExternalClass font,
.ExternalClass td,
.ExternalClass div {
  line-height: 100%;
}

[owa] .email-row .email-col {
  display: table-cell;
  float: none !important;
  vertical-align: top;
}

.ie-container .email-col-100,
.ie-container .email-row,
[owa] .email-col-100,
[owa] .email-row {
  width: 650px !important;
}
.ie-container .email-col-17,
[owa] .email-col-17 {
  width: 110.50000000000001px !important;
}
.ie-container .email-col-25,
[owa] .email-col-25 {
  width: 162.5px !important;
}
.ie-container .email-col-33,
[owa] .email-col-33 {
  width: 214.5px !important;
}
.ie-container .email-col-50,
[owa] .email-col-50 {
  width: 325px !important;
}
.ie-container .email-col-67,
[owa] .email-col-67 {
  width: 435.5px !important;
}

@media only screen and (min-width: 670px) {
  .email-row {
    width: 650px !important;
  }
  .email-row .email-col {
    vertical-align: top;
  }
  .email-row .email-col-100 {
    width: 650px !important;
  }
  .email-row .email-col-67 {
    width: 435.5px !important;
  }
  .email-row .email-col-50 {
    width: 325px !important;
  }
  .email-row .email-col-33 {
    width: 214.5px !important;
  }
  .email-row .email-col-25 {
    width: 162.5px !important;
  }
  .email-row .email-col-17 {
    width: 110.50000000000001px !important;
  }
}

@media (max-width: 670px) {
  .email-row-container {
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
  .email-row .email-col {
    min-width: 320px !important;
    max-width: 100% !important;
    display: block !important;
  }
  .email-row {
    width: calc(100% - 40px) !important;
  }
  .email-col {
    width: 100% !important;
  }
  .email-col > div {
    margin: 0 auto;
  }
  .no-stack .email-col {
    min-width: 0 !important;
    display: table-cell !important;
  }
  .no-stack .email-col-50 {
    width: 50% !important;
  }
  .no-stack .email-col-33 {
    width: 33% !important;
  }
  .no-stack .email-col-67 {
    width: 67% !important;
  }
  .no-stack .email-col-25 {
    width: 25% !important;
  }
  .no-stack .email-col-17 {
    width: 17% !important;
  }
}

@media (max-width: 480px) {
  .hide-mobile {
    display: none !important;
    max-height: 0px;
    overflow: hidden;
  }

  .full-width-mobile {
    width: 100% !important;
    max-width: 100% !important;
  }
}

@media (min-width: 980px) {
  .hide-desktop {
    display: none !important;
    max-height: none !important;
  }
}

    </style>
  
  
<!--[if mso]>
<style type="text/css">
  ul li {
    list-style:disc inside;
    mso-special-format:bullet;
  }
</style>
<![endif]-->

</head>

<body class="clean-body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #f2f2f2">
  <!--[if IE]><div class="ie-container"><![endif]-->
  <!--[if mso]><div class="mso-container"><![endif]-->
  <table class="nl-container" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f2f2f2;width:100%" cellpadding="0" cellspacing="0">
  <tbody>
  <tr style="vertical-align: top">
    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #f2f2f2;"><![endif]-->
    

<div class="email-row-container" style="padding: 25px 10px 0px;background-color: rgba(255,255,255,0)">
  <div style="Margin: 0 auto;min-width: 320px;max-width: 650px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;" class="email-row">
    <div style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 25px 10px 0px;background-color: rgba(255,255,255,0);" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px;"><tr style="background-color: #ffffff;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="650" style="width: 650px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
<div class="email-col email-col-100" style="max-width: 320px;min-width: 650px;display: table-cell;vertical-align: top;">
  <div style="width: 100% !important;">
  <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
  
<table id="u_content_image_1" class="u_content_image" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:30px;font-family:arial,helvetica,sans-serif;" align="left">
        
<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding-right: 0px;padding-left: 0px;" align="center">
      
      <img align="center" border="0" src="par.gg/favicon/android-chrome-192x192.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 32px;" width="32"/>
      
    </td>
  </tr>
</table>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
</div>



<div class="email-row-container" style="padding: 0px 10px;background-color: rgba(255,255,255,0)">
  <div style="Margin: 0 auto;min-width: 320px;max-width: 650px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;" class="email-row">
    <div style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px 10px;background-color: rgba(255,255,255,0);" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px;"><tr style="background-color: #ffffff;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="650" style="width: 650px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
<div class="email-col email-col-100" style="max-width: 320px;min-width: 650px;display: table-cell;vertical-align: top;">
  <div style="width: 100% !important;">
  <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
  
<table id="u_content_text_3" class="u_content_text" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:40px 20px 10px;font-family:arial,helvetica,sans-serif;" align="left">
        
  <div style="color: #000; line-height: 150%; text-align: center; word-wrap: break-word;">
    <p style="line-height: 150%; font-size: 14px;"><span style="font-size: 20px; line-height: 30px;">${blockOneText}</span></p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

<table id="u_content_text_4" class="u_content_text" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 20px;font-family:arial,helvetica,sans-serif;" align="left">
        
  <div style="color: #000; line-height: 150%; text-align: center; word-wrap: break-word;">
    <p style="line-height: 150%; font-size: 14px;"><span style="font-size: 20px; line-height: 30px;">${blockTwoText}</span></p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

<table id="u_content_divider_1" class="u_content_divider" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 20px;font-family:arial,helvetica,sans-serif;" align="left">
        
  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #CCC;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
      <tr style="vertical-align: top">
        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
          <span>&#160;</span>
        </td>
      </tr>
    </tbody>
  </table>

      </td>
    </tr>
  </tbody>
</table>

<table id="u_content_text_5" class="u_content_text" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 20px;font-family:arial,helvetica,sans-serif;" align="left">
        
  <div style="color: #07a88b; line-height: 150%; text-align: center; word-wrap: break-word;">
    <p style="font-size: 14px; line-height: 150%;"><span style="font-size: 16px; line-height: 24px; color: #000000;"><span style="line-height: 24px; font-size: 16px;">${blockThreeText}</span></span></p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

<table id="u_content_button_1" class="u_content_button" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:20px 20px 50px;font-family:arial,helvetica,sans-serif;" align="left">
        
<div align="center">
  <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;font-family:arial,helvetica,sans-serif;"><tr><td style="font-family:arial,helvetica,sans-serif;" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${actionUrl}" style="height:85px; v-text-anchor:middle; width:306px;" arcsize="47%" stroke="f" fillcolor="#4ca8c5"><w:anchorlock/><center style="color:#ffffff;font-family:arial,helvetica,sans-serif;"><![endif]-->
    <a href="${actionUrl}" target="_blank" style="box-sizing: border-box;display: inline-block;font-family:arial,helvetica,sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #ffffff; background-color: #4ca8c5; border-radius: 40px; -webkit-border-radius: 40px; -moz-border-radius: 40px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;border-top-color: #4ca8c5; border-top-style: solid; border-top-width: 0px; border-left-color: #4ca8c5; border-left-style: solid; border-left-width: 0px; border-right-color: #4ca8c5; border-right-style: solid; border-right-width: 0px; border-bottom-color: #4ca8c5; border-bottom-style: solid; border-bottom-width: 0px;">
      <span style="display:block;padding:20px 50px;line-height:150%;"><strong><span style="font-size: 30px; line-height: 45px;">${actionLabel}</span></strong></span>
    </a>
  <!--[if mso]></center></v:roundrect></td></tr></table><![endif]-->
</div>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
</div>


    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    </td>
  </tr>
  </tbody>
  </table>
  <!--[if (mso)|(IE)]></div><![endif]-->
</body>

</html>
`;
