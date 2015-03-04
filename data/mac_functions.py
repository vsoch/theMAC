#!/usr/bin/python

import pandas
import numpy as np

"""Convert a csv file with columns node1,node2,weight,time1,time2 to json for d3"""
def prepare_json(input_file,output_file):
  data = pandas.read_csv(input_file)
  # Get unique nodes
  nodes = np.sort(np.unique(data.node1.tolist() + data.node2.tolist()))
  timepoints = np.sort(np.unique(data.time1.tolist() + data.time2.tolist()))
  # For each node, find links, weights, and timepoints
  for n in nodes:
    

