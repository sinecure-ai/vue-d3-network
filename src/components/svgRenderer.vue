<template lang="pug">
  div(
    id="chart-root"
  )
    svg(
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink= "http://www.w3.org/1999/xlink"
      ref="svg"
      :width="size.w"
      :height="size.h"
      class="net-svg"
      @mouseup='emit("dragEnd",[$event])'
      @touchend.passive='emit("dragEnd",[$event])'
      @touchstart.passive=''
      )

      g(
        class="x-axis"
        :transform="`translate(10, ${this.size.h - 100})`"
        )
      g(
        class="y-axis"
        :transform="`translate(60, 0)`"
        )

      g(
        :transform="`translate(5, ${this.size.h / 2})`"
        )
        text(
          :x='20'
          :y='10'
          :font-size="fontSize"
          stroke="#000000"
          :transform="`translate(0,0) rotate(270)`"
          ) Percentage of Match
      g(
        :transform="`translate(${this.size.w / 2}, ${this.size.h - 75})`"
        )
        text(
          :x='20'
          :y='10'
          :font-size="fontSize"
          stroke="#000000"
          ) Years Of Experience
      //- circle(
      //-   :r="size.w / 6"
      //-   :cx="size.w / 2.5"
      //-   :cy="size.h / 2.5"
      //-   :style="{ fill: '#ffb3ad', fillOpacity: 1}"
      //- )
      //- text(
      //-   :x="size.w / 6"
      //-   :y="size.h / 6"
      //-   :style="{ fill: '#000000'}"
      //- ) Javascript, HTML, CSS

      //- circle(
      //-   :r="size.w / 6"
      //-   :cx="size.w / 1.5"
      //-   :cy="size.h / 2.5"
      //-   :style="{ fill: '#adffca', fillOpacity: 0.5}"
      //- )

      //- text(
      //-   :x="size.w / 4"
      //-   :y="size.h / 1.2"
      //-   :style="{ fill: '#000000'}"
      //- ) Python, MySql

      //- circle(
      //-   :r="size.w / 6"
      //-   :cx="size.w / 2"
      //-   :cy="size.h / 1.5"
      //-   :style="{ fill: '#adbeff', fillOpacity: 0.5}"
      //- )

      //- text(
      //-   :x="size.w / 1.2"
      //-   :y="size.h / 6"
      //-   :style="{ fill: '#000000'}"
      //- ) CI/CD, Dev Ops

      //- circle(
      //-   :r="size.w / 4"
      //-   :cx="size.w / 1.5"
      //-   :cy="size.h / 1.5"
      //-   :style="{ fill: '#c2c2c2'}"
      //- )

      //- text(
      //-   :x="(size.w / 2) + 15"
      //-   :y="(size.h / 2) + 15"
      //-   :style="{ fill: '#000000'}"
      //- ) Python,

      //- defs.paths#1-paths
      //-     clipPath(v-for='(node,key) in nodes'
      //-      :id="`pattern-${node.id}`")
      //-         circle(
      //-           :r="getNodeSize(node) / 4"
      //-           @click='emit("nodeClick",[$event,node])'
      //-           @touchend.passive='emit("nodeClick",[$event,node])'
      //-           @mousedown.prevent='emit("dragStart",[$event,key])'
      //-           @touchstart.prevent='emit("dragStart",[$event,key])'
      //-           :cx="node.x"
      //-           :cy="node.y"
      //-           :style='nodeStyle(node)'
      //-           :title="node.name"
      //-           :class="nodeClass(node)"
      //-           v-bind='node._svgAttrs'
      //-           )

      //-> links

      g(v-for="(item, index) in legends"
        :transform="`translate(${(index + 1) * 100}, 100)`"
        )
        rect(
          :id="item.id"
          :fill="color[item.name]"
          :width="15"
          :height="15"
          )
        text(
          :x='20'
          :y='10'
          :font-size="fontSize"
          stroke="#000000"
          ) {{ item.name }}

      g.links#l-links
          path(v-for="link in links"
            :d="linkPath(link)"
            :id="link.id"
            @click='emit("linkClick",[$event,link])'
            @touchstart.passive='emit("linkClick",[$event,link])'
            v-bind='linkAttrs(link)'
            :class='linkClass(link.id)'
            :style='linkStyle(link)'
            )

      //- -> nodes
      g.nodes#l-nodes(v-if='!noNodes')
        template(v-for='(node,key) in nodes')
          svg(v-if='svgIcon(node)'
            :key='key'
            :viewBox='svgIcon(node).attrs.viewBox'
            :width='getNodeSize(node, "width")'
            :height='getNodeSize(node, "height")'
            @click='nodeSingleClick($event, node, key)'
            @touchend.passive='nodeSingleClick($event, node, key)'
            @mousedown.prevent='emit("dragStart",[$event,key])'
            @touchstart.prevent='emit("dragStart",[$event,key])'
            :x='node.x - getNodeSize(node, "width") / 2'
            :y='node.y - getNodeSize(node, "height") / 2'
            :style='nodeStyle(node)'
            :title="node.name"
            :class='nodeClass(node,["node-svg"])'
            v-html='svgIcon(node).data'
            v-bind='node._svgAttrs'
            )

          image(v-else-if='imgNode(node)'
            :key='key'
            :xlink:href='imgNodeUrl(node)'
            :width='imgNodeWidth(node, "width")'
            :height='imgNodeHeight(node, "height")'
            @click='nodeSingleClick($event, node, key)'
            @touchend.passive='nodeSingleClick($event, node, key)'
            @mousedown.prevent='emit("dragStart",[$event,key])'
            @touchstart.prevent='emit("dragStart",[$event,key])'
            :x="node.x - (nodeSize / 2)"
            :y="node.y - (nodeSize / 2)"
            :style='imgNodeStyle(node)'
            :class="imgNodeClass(node)"
            v-bind='node._svgAttrs'
            )

              //- default circle nodes
          circle(v-else
            :key='key'
            :r="getNodeSize(node) / 4"
            @click='nodeSingleClick($event, node, key)'
            @touchend.passive='nodeSingleClick($event, node, key)'
            @mousedown.prevent='emit("dragStart",[$event,key])'
            @touchstart.prevent='emit("dragStart",[$event,key])'
            :cx="node.x"
            :cy="node.y"
            :style='nodeStyle(node)'
            :title="node.name"
            :class="nodeClass(node)"
            v-bind='node._svgAttrs'
            )

          g(
            v-for="item in node.pie"
            :transform="`translate(${node.x}, ${node.y})`"
          )
            path(
              :d="arcGenerator(item)"
              :id="item.data.id"
              :fill="skillFill(item, node)"
            )

      //-> Links Labels
      g.labels#link-labels(v-if='linkLabels')
        text.link-label(v-for="link in links" :font-size="fontSize" )
          textPath(v-bind:xlink:href="'#' + link.id" startOffset= "50%") {{ link.name }}

      //- -> Node Labels
      g.labels#node-labels( v-if="nodeLabels")
        text.node-label(v-for="node in nodes"
          :x='(node.x - 35) + labelOffset.x'
          :y='(node.y) + labelOffset.y'
          :font-size="fontSize"
          :class='(node._labelClass) ? node._labelClass : ""'
          :stroke-width='fontSize / 8'
        ) {{ node.name }}

    div(
      id="tooltip"
      v-bind:style="{ alignItems: 'center', textAlign: 'center', paddingTop: '10px', border: '1px solid #000', zIndex: 99999, position: 'absolute', top: tooltipy, left: tooltipx, visibility: tooltipVisible? 'visible': 'hidden', width: '250px', backgroundColor: '#ffffff'}"
    )
      div(
        id="tooltip-header"
        style="width: 100%;"
      )
        img(
          v-if="selectedNode && selectedNode.imgObj"
          id="tooltip-img"
          :src="selectedNode.imgObj.url"
          style="width: 50px; height: 50px;"
        )
      div(
        id="tooltip-title"
        v-if="selectedNode && selectedNode.name"
      )
        h4() {{selectedNode.name}}
        div( id="jobs-container"  v-bind:style="{ maxHeight: '200px', overflowY: 'scroll' }" )
          div( id="job-container" v-bind:style="{paddingLeft: '10px', alignItems: 'left', textAlign: 'left'}" v-for="item in selectedNode.jobs" )
            p(style="fontSize: 14px; font-weight: 300;") {{item.job_title}}
            p(style="fontSize: 10px;") {{item.company.name}}
            p(style="fontSize: 10px;") {{item.job_started}} - {{item.job_ended != null? item.job_ended : 'present'}}
            hr()
        button(@touchend.passive='emit("nodeClick",[$event,selectedNode])'   @click='emit("nodeClick",[$event,selectedNode])'  style="margin-left: 10px; width: 90%; height: 25px; backgroundColor: #14325C; color: #ffffff;") View Profile
        div(
          id="tooltip-button-group"
          style="width: 100%; padding: 5px;"
        )
          button(@touchend.passive='nodeSingleClickRemove($event, selectedNode)'   @click='nodeSingleClickRemove($event, selectedNode)'  style="width: 45%; height: 25px; backgroundColor: green; color: #ffffff;") Accept
          button(@touchend.passive='nodeSingleClickRemove($event, selectedNode)'   @click='nodeSingleClickRemove($event, selectedNode)'  style="width: 45%; height: 25px; backgroundColor: red; color: #ffffff;") Reject

</template>
<script>
import svgExport from '../lib/js/svgExport.js'
import * as d3 from 'd3'
import { arc } from 'd3-shape'

export default {
  name: 'svg-renderer',
  props: [
    'size',
    'nodes',
    'noNodes',
    'selected',
    'linksSelected',
    'links',
    'nodeSize',
    'padding',
    'fontSize',
    'strLinks',
    'linkWidth',
    'nodeLabels',
    'linkLabels',
    'labelOffset',
    'nodeSym',
    'color',
    'legends'
  ],
  data () {
    return {
      tooltipy: '0px',
      tooltipx: '0px',
      tooltipHeader: 'Test',
      tooltipVisible: false,
      selectedNode: {

      },
      selectedNodeIndex: null
    }
  },
  computed: {
    nodeSvg () {
      if (this.nodeSym) {
        return svgExport.toObject(this.nodeSym)
      }
      return null
    },
    arcGenerator () {
      return arc()
        .innerRadius(10)
        .outerRadius(20)
    },
    yScale () {
      return d3.scaleLinear().range([this.size.h - 200, 200]).domain([0, this.legends.length])
    },
    xScale () {
      return d3.scaleLinear().range([100, this.size.w]).domain([0, 10])
    }
  },
  mounted () {
    this.renderAxis()
  },
  methods: {
    renderAxis () {
      d3.select('.x-axis').call(d3.axisBottom(this.xScale))
      d3.select('.y-axis').call(d3.axisLeft(this.yScale).ticks(4).tickFormat((d) => {
        return this.legends.length > 0 ? `${((d / this.legends.length) * 100).toFixed()} %` : d
      }))
    },
    skillFill (item, node) {
      const index = node.skills.findIndex((skill) => { return item.data.name === skill.graph_skill.name })
      return index >= 0 ? this.color[item.data.name] : 'gray'
    },
    nodeSingleClick (e, node, index) {
      if (this.selectedNode && this.selectedNode.id === node.id) {
        this.selectedNode = null
        this.tooltipVisible = false
        this.selectedNodeIndex = null
      } else {
        this.tooltipy = `${e.clientY}px`
        this.tooltipx = `${e.clientX}px`
        this.tooltipVisible = true
        this.selectedNode = node
        this.selectedNodeIndex = index
      }
    },
    nodeSingleClickRemove (e, node) {
      this.nodes.splice(this.selectedNodeIndex, 1)
      this.selectedNode = null
      this.tooltipVisible = false
      this.selectedNodeIndex = null
    },
    getNodeSize (node, side) {
      let size = node._size || this.nodeSize
      if (side) size = node['_' + side] || size
      return size
    },
    imgNodeWidth (node, side) {
      console.log(node)
      let size = node._size || this.nodeSize
      if (side) size = node['_' + side] || size
      return node.added ? size + 25 : size
    },
    imgNodeX (node) {
      return node.x - this.imgNodeWidth(node, 'width')
    },
    imgNodeY (node) {
      return node.y - this.imgNodeHeight(node, 'height')
    },
    imgNodeHeight (node, side) {
      let size = node._size || this.nodeSize
      if (side) size = node['_' + side] || size
      return node.added ? size + 25 : size
    },
    imgNode (node) {
      return node.imgObj
    },
    imgNodeUrl (node) {
      return node.imgObj.url
    },
    svgIcon (node) {
      return node.svgObj || this.nodeSvg
    },
    emit (e, args) {
      this.$emit('action', e, args)
    },
    svgScreenShot (cb, toSvg, background, allCss) {
      let svg = svgExport.export(this.$refs.svg, allCss)
      if (!toSvg) {
        if (!background) background = this.searchBackground()
        let canvas = svgExport.makeCanvas(this.size.w, this.size.h, background)
        svgExport.svgToImg(svg, canvas, (err, img) => {
          if (err) cb(err)
          else cb(null, img)
        })
      } else {
        cb(null, svgExport.save(svg))
      }
    },
    linkClass (linkId) {
      let cssClass = ['link']
      if (this.linksSelected.hasOwnProperty(linkId)) {
        cssClass.push('selected')
      }
      if (!this.strLinks) {
        cssClass.push('curve')
      }
      return cssClass
    },
    linkPath (link) {
      let d = {
        M: [link.source.x | 0, link.source.y | 0],
        X: [link.target.x | 0, link.target.y | 0]
      }
      if (this.strLinks) {
        return 'M ' + d.M.join(' ') + ' L' + d.X.join(' ')
      } else {
        d.Q = [link.source.x, link.target.y]
        return 'M ' + d.M + ' Q ' + d.Q.join(' ') + ' ' + d.X
      }
    },
    nodeStyle (node) {
      return (node._color) ? 'fill: ' + node._color : ''
    },
    imgNodeStyle (node) {
      return (node._color) ? 'fill: ' + node._color : ''
    },
    linkStyle (link) {
      let style = {}
      if (link._color) style.stroke = link._color
      return style
    },
    nodeClass (node, classes = []) {
      let cssClass = (node._cssClass) ? node._cssClass : []
      if (!Array.isArray(cssClass)) cssClass = [cssClass]
      cssClass.push('node')
      classes.forEach(c => cssClass.push(c))
      if (this.selected[node.id]) cssClass.push('selected')
      if (node.fx || node.fy) cssClass.push('pinned')
      return cssClass
    },
    imgNodeClass (node, classes = []) {
      let cssClass = (node._cssClass) ? node._cssClass : []
      if (!Array.isArray(cssClass)) cssClass = [cssClass]
      cssClass.push('node')
      classes.forEach(c => cssClass.push(c))
      if (this.selected[node.id]) cssClass.push('selected')
      if (node.fx || node.fy) cssClass.push('pinned')
      return cssClass
    },
    searchBackground () {
      let vm = this
      while (vm.$parent) {
        let style = window.getComputedStyle(vm.$el)
        let background = style.getPropertyValue('background-color')
        let rgb = background.replace(/[^\d,]/g, '').split(',')
        let sum = rgb.reduce((a, b) => parseInt(a) + parseInt(b), 0)
        if (sum > 0) return background
        vm = vm.$parent
      }
      return 'white'
    },
    spriteSymbol () {
      let svg = this.nodeSym
      if (svg) {
        return svgExport.toSymbol(svg)
      }
    },
    linkAttrs (link) {
      let attrs = link._svgAttrs || {}
      attrs['stroke-width'] = attrs['stroke-width'] || this.linkWidth
      return attrs
    },
    mouseover (e, node) {
      this.emit('mouseOver', [e, node])
      d3.select(e.target).style('width', 100).style('height', 100)
    },
    mouseout (e, node) {
      this.emit('mouseOut', [e, node])
      d3.select(e.target).style('width', 50).style('height', 50)
    }
  }
}
</script>
