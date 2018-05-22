export default function mountNode(mountedNode, containingNode) {
    /* eslint no-param-reassign: "off" */
    containingNode.innerHTML = '';
    containingNode.appendChild(mountedNode);
}
