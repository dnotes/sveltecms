import { formDataHandler } from './formDataHandler';
async function parseRequest(cms, contentType, request) {
    let data;
    let format = request.headers.get('Content-Type');
    if (format === 'application/json') {
        data = await request.json();
        return { format, data };
    }
    else if (format.match(/^multipart\/form-data/)) {
        let formdata = await request.formData();
        data = await formDataHandler(cms, contentType, formdata);
        return { format, data };
    }
    throw new Error(`Content-Type must be application/json or multipart/form-data (got ${format})`);
}
async function saveContentEndpoint(cms, contentType, request, options = {}) {
    let content;
    try {
        let { format, data } = await parseRequest(cms, contentType, request);
        content = data;
        if (format === 'application/json') {
            let response = await cms.saveContent(contentType, content, options);
            response.headers['Content-Type'] = 'application/json';
            return response;
        }
        else if (format === 'multipart/form-data') {
            await cms.saveContent(contentType, content, options);
            return;
        }
    }
    catch (error) {
        return {
            status: 500,
            body: {
                message: error.message,
                request,
                content,
                stack: error.stack.split('\n'),
            }
        };
    }
}
async function deleteContentEndpoint(cms, contentType, request, options = {}) {
    let content;
    try {
        let { format, data } = await parseRequest(cms, contentType, request);
        if (format === 'application/json') {
            let response = await cms.deleteContent(contentType, content, options);
            response.headers['Content-Type'] = 'application/json';
            return response;
        }
        else if (format === 'multipart/form-data') {
            await cms.deleteContent(contentType, content, options);
            return;
        }
    }
    catch (error) {
        return {
            status: 500,
            body: {
                message: error.message,
                request,
                content,
                stack: error.stack.split('\n'),
            }
        };
    }
}
export { parseRequest, saveContentEndpoint, deleteContentEndpoint, };
