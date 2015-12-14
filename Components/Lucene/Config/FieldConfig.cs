﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Satrabel.OpenContent.Components.Lucene.Config
{
    public class FieldConfig
    {
        [JsonProperty(PropertyName = "type")]
        public string Type { get; set; }
        [JsonProperty(PropertyName = "index")]
        public bool Index { get; set; }
        [JsonProperty(PropertyName = "sort")]
        public bool Sort { get; set; }
        [JsonProperty(PropertyName = "fields")]
        public Dictionary<string, FieldConfig> Fields { get; set; }
        [JsonProperty(PropertyName = "items")]
        public FieldConfig Items { get; set; }

    }
}
