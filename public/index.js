let node = document.createElement('div');
node.innerText = 'This section was appended by javascript code';
node.className = 'appended';
document.querySelector('.container').appendChild(node);