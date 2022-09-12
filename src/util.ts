export function toQueryString(obj: { [x: string]: string }) {
    var str = [];
    for (var p in obj)
      {if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }}
    return str.join("&");
}