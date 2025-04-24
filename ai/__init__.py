"""
Import the model patches immediately to ensure they're available
"""

# Import patches early to ensure they're applied before any transformers imports
from . import model_patches

# Apply patches to global namespace as well
import sys
sys.modules['transformers.modeling_utils.init_empty_weights'] = model_patches.init_empty_weights
sys.modules['transformers.modeling_utils.find_tied_parameters'] = model_patches.find_tied_parameters  
sys.modules['transformers.modeling_utils.no_init_weights'] = model_patches.no_init_weights