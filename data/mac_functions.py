#!/usr/bin/python

import json
import pandas
import numpy as np

"""Convert a csv file with columns node1,node2,weight,time1,time2 to json for d3"""
def prepare_json(input_file,output_file):
  data = pandas.read_csv(input_file)
  # Get unique nodes
  nodes = np.sort(np.unique(data.node1.tolist() + data.node2.tolist()))
  timepoints = np.sort(np.unique(data.time1.tolist() + data.time2.tolist()))
  # For each node, find links, weights, and timepoints
  node_json = []
  for n in nodes:
    # Get the subset of the data for the node
    data_subset = data.loc[data.node1==n]
    # Sort by the timepoint 1
    data_subset = data_subset.sort(columns="time1")
    # Save node id, connections, and timepoints  
    node_json.append({"id":n,
                      "connections":data_subset.node2.tolist(),
                      "timepoints":data_subset.time1.tolist()})
  with open(output_file, 'wb') as outfile:
    json.dump(node_json, outfile)
  return json.dumps(node_json)
  
    

