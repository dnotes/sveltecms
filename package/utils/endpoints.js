import { formDataHandler } from './formDataHandler';
function getFormat(format) {
    if (format === 'application/json')
        return 'json';
    else if (format.match(/^multipart\/form-data/))
        return 'form';
}
async function parseRequest(cms, contentType, request) {
    let data;
    let format = getFormat(request.headers.get('Content-Type'));
    if (format === 'json') {
        data = await request.json();
        return { format, data };
    }
    else if (format === 'form') {
        let formdata = await request.formData();
        data = await formDataHandler(cms, contentType, formdata);
        return { format, data };
    }
    throw new Error(`Content-Type must be application/json or multipart/form-data (got ${format})`);
}
async function saveContentEndpoint(cms, contentType, request, options = {}) {
    let { format, data } = await parseRequest(cms, contentType, request);
    let content = await cms.saveContent(contentType, data, options);
    return content;
}
async function deleteContentEndpoint(cms, contentType, request, options = {}) {
    let { format, data } = await parseRequest(cms, contentType, request);
    let content = await cms.deleteContent(contentType, data, options);
    return content;
}
export { parseRequest, saveContentEndpoint, deleteContentEndpoint, };
