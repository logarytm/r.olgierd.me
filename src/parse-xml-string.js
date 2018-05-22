export default function parseXMLString(s) {
    const parser = new window.DOMParser();
    return parser.parseFromString(s, 'text/xml');
}
