#!/usr/bin/python

import json
import pandas
import numpy as np

"""Perform Hungarian"""
def do_hungarian(matrix):
  print "MAC: write function here to perform hungarian and return the csv file"

"""Remove rows of zeros from input files from matlab"""
def remove_zeros(input_file,add_col_labels=True):
  if add_col_labels == True:
    data = pandas.read_csv(input_file,header=None)
    data = add_column_labels(data)
    data = data[data.sum(axis=1)!=0]
    data.to_csv(input_file,index=False)
  else:
    data = pandas.read_csv(input_file)
    data = data[data.sum(axis=1)!=0]
    data.to_csv(input_file,header=False,index=False)

"""Rename node numbers to correspond from 1..N, data is assumed to have header"""
def rename_nodes_sequential(input_file,sort_by_length=True):
    data = pandas.read_csv(input_file)
    unique_nodes = np.unique(data.node1.tolist() + data.node2.tolist())
    new_names = range(1,len(unique_nodes)+1)
    if sort_by_length == True:
      # Find node connections within same module
      within_modules = data[data.node1==data.node2]
      ordered_unique_nodes = within_modules.node1.value_counts().index
      # We need to append nodes that don't have connections to themselves, ever
      lonely_nodes = np.setdiff1d(unique_nodes,ordered_unique_nodes) 
      unique_nodes = ordered_unique_nodes.tolist() + lonely_nodes.tolist()
    data.node1 = data.node1.replace(to_replace=unique_nodes, value=new_names)
    data.node2 = data.node2.replace(to_replace=unique_nodes, value=new_names)
    data.to_csv(input_file,index=False)


"""Add column labels"""
def add_column_labels(df,column_labels=["node1","node2","weight","time1","time2"]):
  df.columns = column_labels
  return df

"""Convert a csv file with columns node1,node2,weight,time1,time2 to json"""
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
  
    

