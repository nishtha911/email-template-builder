export const compileToHTML = (elements) => {
    const rows = elements.map(el => {
        if (el.type === 'text') {
            return `<tr><td style="padding: 20px; color: #333; font-family: Arial, sans-serif;">${el.content}</td></tr>`;
        }
        if (el.type === 'button') {
            return `
                <tr>
                    <td align="center" style="padding: 20px;">
                        <table border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td align="center" style="border-radius: 5px;" bgcolor="#963991">
                                    <a href="#" target="_blank" style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; padding: 12px 25px; display: inline-block; font-weight: bold;">
                                        ${el.content || 'Click Here'}
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>`;
        }
        if (el.type === 'image') {
            return `<tr><td align="center" style="padding: 20px;"><img src="https://via.placeholder.com/600x200" width="100%" style="display: block; border: 0;" /></td></tr>`;
        }
        return '';
    }).join('');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { margin: 0; padding: 0; background-color: #f4f4f4; }
                .wrapper { width: 100%; table-layout: fixed; background-color: #f4f4f4; padding-bottom: 40px; }
                .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; font-family: sans-serif; color: #4a4a4a; }
            </style>
        </head>
        <body>
            <center class="wrapper">
                <table class="main" width="100%">
                    ${rows}
                </table>
            </center>
        </body>
        </html>
    `;
};