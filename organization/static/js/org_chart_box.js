/**
 * Created by tcockcroft on 12/4/15.
 */

$(document).ready(function () {
    //function that collects name from json tree data
    //===============================================
    function select2DataCollectName(d) {
        if (d.children)
            d.children.forEach(select2DataCollectName);
        else if (d._children)
            d._children.forEach(select2DataCollectName);
        select2Data.push(d.name);
    }

//    search the tree for the name and build links back up
//===============================================
    function searchTree(d) {
        if (d.children)
            d.children.forEach(searchTree);
        else if (d._children)
            d._children.forEach(searchTree);
        var searchFieldValue = eval(searchField);
        if (searchFieldValue && searchFieldValue.match(searchText)) {
            // Walk parent chain
            var ancestors = [];
            var parent = d;
            while (typeof(parent) !== "undefined") {
                ancestors.push(parent);
                //console.log(parent);
                parent.class = "found";
                parent = parent.parent;
            }
            //console.log(ancestors);
        }
    }

//    reset chart
//===============================================
    function clearAll(d) {
        d.class = "";
        if (d.children)
            d.children.forEach(clearAll);
        else if (d._children)
            d._children.forEach(clearAll);
    }

//    collaps chart
//===============================================
    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

//    search for the class "found" and collapse all those not found
//===============================================
    function collapseAllNotFound(d) {
        if (d.children) {
            if (d.class !== "found") {
                d._children = d.children;
                d._children.forEach(collapseAllNotFound);
                d.children = null;
            } else
                d.children.forEach(collapseAllNotFound);
        }
    }

//    expand all nodes
//===============================================
    function expandAll(d) {
        if (d._children) {
            d.children = d._children;
            d.children.forEach(expandAll);
            d._children = null;
        } else if (d.children)
            d.children.forEach(expandAll);
    }

//


//===============================================
// Toggle children on click.
    function toggle(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        clearAll(root);
        update(d);
        $("#searchName").select2("val", "");
    }

//    function that collects the data from the select 2 bar and implements the search functions from above
//===============================================
    $("#searchName").on("select2-selecting", function (e) {
        clearAll(root);
        expandAll(root);
        update(root);

        searchField = "d.name";
        searchText = e.object.text;
        searchTree(root);
        root.children.forEach(collapseAllNotFound);
        update(root);
    });
    var padding = 5;
    var margin = {
            top: 20,
            right: 0,
            bottom: 20,
            left: 0
        },
        width = 1950 - margin.right - margin.left,
        height = 780 - margin.top - margin.bottom;

    var root = {};


//  load data from api call to the django view and  create index of their names
//
    d3.json("/test/", function (error, flare) {
        root = flare;
        root.x0 = height / 2;
        root.y0 = 0;

        select2Data = [];
        select2DataCollectName(root);
        select2DataObject = [];
        select2Data.sort(function (a, b) {
                if (a > b) return 1; // sort
                if (a < b) return -1;
                return 0;
            })
            .filter(function (item, i, ar) {
                return ar.indexOf(item) === i;
            }) // remove duplicate items
            .filter(function (item, i, ar) {
                select2DataObject.push({
                    "id": i,
                    "text": item
                });
            });
        select2Data.sort(function (a, b) {
                if (a > b) return 1; // sort
                if (a < b) return -1;
                return 0;
            })
            .filter(function (item, i, ar) {
                return ar.indexOf(item) === i;
            }) // remove duplicate items
            .filter(function (item, i, ar) {
                select2DataObject.push({
                    "id": i,
                    "text": item
                });
            });


        $("#searchName").select2({
            data: select2DataObject,
            containerCssClass: "search"
        });


    //    //collapse function?
        function collapse(d) {
            if (d.children) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
            }
        }

        root.children.forEach(collapse);
        update(root);
    });

    var i = 0,
        duration = 750,
        rectW = 200,
        rectH = 70;
    //set node size, tree layout, etc

    var tree = d3.layout.tree().nodeSize([rectW, rectH]);
    var diagonal = d3.svg.diagonal()
        .projection(function (d) {
            return [d.x + rectW / 2, d.y + rectH / 2];
        });


    //add svg to chart div
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", 1950)
        .attr("height", 1000)
        //.attr("align","center")
        .call(d3.behavior.zoom().on("zoom", function () {
            svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
        }))
        .append("g");

    //unused function
    function reponse_data(d) {
        return d.name + '\n' + check("\nTeam: ", d.organization) + check("\nRegion: ", d.region) + check("\nWorks in ", d.office) + check("\nExpert at:  ", d.expertise) + check("\nInterested in: " + d.interests)
    }


    root.x0 = 0;
    root.y0 = height / 2;

    d3.select("#chart").style("height", "1000px");

    function update(source) {

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        // Normalize for fixed-depth.
        nodes.forEach(function (d) {
            d.y = d.depth * 180;
        });

        // Update the nodes…
        var node = svg.selectAll("g.node")
            .data(nodes, function (d) {
                return d.id || (d.id = ++i);
            });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + source.x0 + "," + source.y0 + ")";
            })
            .on("click", click);

        // create rectangles for the nodes
        nodeEnter.append("rect")
            .attr("width", rectW)
            .attr("height", rectH)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
            });


        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1, .3);

        //  append name to the rectangle
        nodeEnter.append("text")
            .attr("x", rectW / 2)
            .attr("y", rectH / 7)
            .attr("dy", ".35em")
            .attr("class", "name")

            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("font-weight", "bold")
            .text(function (d) {
                return d.name;
            });

        // append where they work to the rectangle

        node.append("text")
            .attr("x", rectW / 2)
            .attr("y", 6 * (rectH / 7))
            .attr("dy", ".55em")
            .attr("class", "about")
            .attr("text-anchor", "middle")

            .text(function (d) {
                return d.office;
            })
            //.call(wrap(, 23))
        ;

        //append their title to the rectangle
        node.append("text")
            .attr("x", rectW / 2)
            .attr("y", 3 * (rectH / 7))
            .attr("dy", ".35em")
            .attr("class", "about")
            .attr("text-anchor", "middle")

            .text(function (d) {
                return d.extra;
            });

        //append organization to the rectangle
        node.append("text")
            .attr("x", rectW / 2)
            .attr("y", 4.5 * (rectH / 7))
            .attr("dy", ".35em")
            .attr("class", "about")
            .attr("text-anchor", "middle")

            .text(function (d) {
                return d.organization;
            });

        // append data in tool tip
        nodeEnter.append("svg:title")
            .text(function (d) {

                return d.name + "\n" + d.extra + check("\nTeam: ", d.organization) + check("\nRegion: ", d.region) + check("\nWorks in ", d.office) + check("\nExpert at:  ", d.expertise) + check("\nInterested in: " + d.interests);
            });

        nodeEnter.append("image")
            .attr("xlink:href", function (d) {
                return d.icon;
            })
            .attr("x", String(rectW / 3))
            .attr("y", "-50px")
            .attr("width", "50px")
            .attr("height", "50px");
        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });


        nodeUpdate.select("rect")
            .attr("r", 4.5)
            .style("fill", function (d) {
                if (d.class === "found") {
                    return "#004DFF"; //red
                } else if (d._children) {
                    return "lightsteelblue";
                } else {
                    return "#fff";
                }
            })
            .style("stroke", function (d) {
                if (d.class === "found") {
                    return "#004DFF"; //red
                }
            });

        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + source.x + "," + source.y + ")";
            })
            .remove();

        nodeExit.select("rect")
            .attr("width", rectW)
            .attr("height", rectH)
            //.attr("width", bbox.getBBox().width)""
            //.attr("height", bbox.getBBox().height)
            .attr("stroke", "black")
            .attr("stroke-width", 1);

        nodeExit.select("text");

        // Update the links…
        var link = svg.selectAll("path.link")
            .data(links, function (d) {
                return d.target.id;
            });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("x", rectW / 2)
            .attr("y", rectH / 2)
            .attr("d", function (d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({
                    source: o,
                    target: o
                });
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal)
            .style("stroke", function (d) {
                if (d.target.class === "found") {
                    return "#004DFF";
                }
            });

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function (d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

// Toggle children on click.
    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }

    function check(data1, data2) {
        if (!data2)
            return "";
        else {
            return data1 + data2
        }
    }




});