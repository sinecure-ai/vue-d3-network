// find links by node => [ links ] | null
export const findLinks = (nodeId, links) => {
  let nodeLinks = []
  for (let link of links) {
    if (link.sid === nodeId || link.tid === nodeId) nodeLinks.push(link)
  }
  return (nodeLinks.length) ? nodeLinks : null
}
export const findNode = (nodes, nodeId) => {
  let index = nodeExists(nodeId)
  if (index) {
    return nodes[index]
  }
  return null
}
// removes node by id => () => ( [newNodes] )
export const removeNode = (nodeId, nodes, cb) => {
  let index = nodes.findIndex(
    (node) => { return node.id === nodeId }
  )
  if (index > -1) {
    nodes.splice(index, 1)
    cb(nodes)
  } else {
    cb(null)
  }
}

// removes orphaned links => { newLinks, removed }
export const rebuildLinks = (nodes, links) => {
  let newLinks = []
  let removed = []
  for (let link of links) {
    if (nodeExists(link.sid, nodes) && nodeExists(link.tid, nodes)) {
      newLinks.push(link)
    } else {
      removed.push(link)
    }
  }
  return { newLinks, removed }
}

// removes unlinked nodes => [ newNodes ]
export const rebuildNodes = (links, nodes) => {
  let newNodes = []
  for (let node of nodes) {
    if (isLinked(node.id, links)) {
      newNodes.push(node)
    }
  }
  return newNodes
}

// finds node by id => boolean
export const nodeExists = (nodeId, nodes) => {
  let index = nodes.findIndex(
    (node) => { return node.id === nodeId }
  )
  return (index > -1)
}

// Checks if node is linked => boolean
const isLinked = (nodeId, links) => {
  let index = links.findIndex(
    (link) => { return (link.tid === nodeId || link.sid === nodeId) }
  )
  return (index > -1)
}

// link formatter
export const newLink = (id, sid, tid) => {
  return { id, sid, tid }
}

// generates random links => [ links ]
export const makeRandomLinks = (nodes, maxLinks) => {
  let links = []
  let id = 0
  for (let node of nodes) {
    let total = Math.floor(Math.random() * maxLinks)
    for (let i = 0; i <= total; i++) {
      let target = Math.floor(Math.random() * nodes.length)
      let source = node.id
      id++
      links.push(newLink(id, source, target))
    }
  }
  return links
}

// random node name
const newNodeName = () => {
  return Math.random().toString(36).substring(7)
}

// node formatter
export const newNode = (nodeId) => {
  
  return {
    id: nodeId,
    name: newNodeName(),
    url: 'https://www.linkedin.com/in/harish-kumar-chellappa-30708863/',
    imgObj: {
      url: 'https://storage.cloud.google.com/webapp-backend-file-storage-sinecure/userfiles/1/user-profile/c5ff79b4-d8a7-4fe5-82d9-489e212b0f9e.png'
    },
    jobs: [
      {
        'job_current': null,
        'job_ended': null,
        'job_started': '2013-03-01',
        'job_title': 'Architect',
        'company': {
          'name': 'StrongLoop, Inc.- purchased by IBM'
        }
      },
      {
        'job_current': null,
        'job_ended': '2012-02-01',
        'job_started': '2007-01-01',
        'job_title': 'Lead Developer',
        'company': {
          'name': 'Terralever'
        }
      },
      {
        'job_current': null,
        'job_ended': '2013-01-01',
        'job_started': '2012-02-01',
        'job_title': 'Co-Founder, CTO, Architect',
        'company': {
          'name': 'Deployd'
        }
      }
    ],
    skills: [
      {graph_skill: {
        name: 'Python',
        id: 1
      }},
      {graph_skill: {
        name: 'Nodejs',
        id: 1
      }},
      {graph_skill: {
        name: 'SQL',
        id: 1
      }}
    ],
    pinned: true
  }
}

// generates random nodes => [ nodes ]
export const makeRandomNodes = (maxNodes) => {
  let nodes = Array.apply(null, { length: maxNodes })
    .map((value, index) => { return newNode(index) })
  return nodes
}

// vue custom event handler
export const methodCall = (vm, action, args) => {
  let method = vm[action]
  if (typeof method === 'function') {
    if (args) method(...args)
    else method()
  } else {
    console.error('Call to undefined method:', action)
  }
}

// vue event wrapper
export const emitEvent = (vm, action, args) => {
  if (vm.$data.conf && vm.$data.conf.allEventsAs) {
    let evName = vm.$data.conf.allEventsAs
    return vm.$emit(evName, action, args)
  }
  return vm.$emit(action, ...args)
}
