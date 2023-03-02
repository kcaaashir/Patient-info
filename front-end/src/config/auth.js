
export const getHeaders = (json = true) => {
    const token = localStorage.getItem("token");
    let headers = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }
    if (!json) {
        headers.headers["Content-Type"] = "multipart/form-data";
    }
    return headers;
}