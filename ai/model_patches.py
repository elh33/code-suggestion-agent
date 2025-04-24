"""
Simple patches for the transformers library to work with Python 3.13
"""
import contextlib
import sys
import importlib

# Minimal implementation of init_empty_weights
@contextlib.contextmanager
def init_empty_weights():
    """Minimal compatibility patch for init_empty_weights"""
    yield

# Minimal implementation of find_tied_parameters
def find_tied_parameters(model):
    """Minimal compatibility patch for find_tied_parameters"""
    return []

# Minimal implementation of no_init_weights
@contextlib.contextmanager
def no_init_weights():
    """Minimal compatibility patch for no_init_weights"""
    yield

# Apply patches immediately
import transformers.modeling_utils

# Directly patch the module
transformers.modeling_utils.init_empty_weights = init_empty_weights
transformers.modeling_utils.find_tied_parameters = find_tied_parameters
transformers.modeling_utils.no_init_weights = no_init_weights

# Also patch the module's globals() dict
if hasattr(transformers.modeling_utils, "__dict__"):
    transformers.modeling_utils.__dict__["init_empty_weights"] = init_empty_weights
    transformers.modeling_utils.__dict__["find_tied_parameters"] = find_tied_parameters
    transformers.modeling_utils.__dict__["no_init_weights"] = no_init_weights

print("Applied transformers patches for Python 3.13 compatibility")