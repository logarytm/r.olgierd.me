export default function mountNode(mountedNode, containingNode) {
  containingNode.innerHTML = '';
  containingNode.appendChild(mountedNode);
}
