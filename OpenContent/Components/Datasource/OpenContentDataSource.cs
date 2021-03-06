﻿using Newtonsoft.Json.Linq;
using Satrabel.OpenContent.Components.Alpaca;
using Satrabel.OpenContent.Components.Datasource.Search;
using Satrabel.OpenContent.Components.Lucene;
using Satrabel.OpenContent.Components.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using Satrabel.OpenContent.Components.Lucene.Config;
using Satrabel.OpenContent.Components.Logging;
using Satrabel.OpenContent.Components.Form;

namespace Satrabel.OpenContent.Components.Datasource
{
    public class OpenContentDataSource : IDataSource
    {
        public virtual string Name => AppConfig.OPENCONTENT;

        #region Queries
        public virtual bool Any(DataSourceContext context)
        {
            OpenContentController ctrl = new OpenContentController();
            return ctrl.GetFirstContent(GetModuleId(context)) != null;
        }
        public virtual JArray GetVersions(DataSourceContext context, IDataItem item)
        {
            var content = (OpenContentInfo)item.Item;
            if (!string.IsNullOrEmpty(content.VersionsJson))
            {
                var verLst = new JArray();
                foreach (var version in content.Versions)
                {
                    var ver = new JObject();
                    ver["text"] = version.LastModifiedOnDate.ToShortDateString() + " " + version.LastModifiedOnDate.ToShortTimeString();
                    if (verLst.Count == 0) // first
                    {
                        ver["text"] = ver["text"] + " ( current )";
                    }
                    ver["ticks"] = version.LastModifiedOnDate.Ticks.ToString();
                    verLst.Add(ver);
                }
                return verLst;
            }
            return null;
        }

        public virtual JToken GetDataVersions(DataSourceContext context, IDataItem item)
        {
            var content = (AdditionalDataInfo)item.Item;
            if (!string.IsNullOrEmpty(content.VersionsJson))
            {
                var verLst = new JArray();
                foreach (var version in content.Versions)
                {
                    var ver = new JObject();
                    ver["text"] = version.LastModifiedOnDate.ToShortDateString() + " " + version.LastModifiedOnDate.ToShortTimeString();
                    if (verLst.Count == 0) // first
                    {
                        ver["text"] = ver["text"] + " ( current )";
                    }
                    ver["ticks"] = version.LastModifiedOnDate.Ticks.ToString();
                    verLst.Add(ver);
                }
                return verLst;
            }
            return null;
        }

        public virtual JToken GetVersion(DataSourceContext context, IDataItem item, DateTime datetime)
        {
            var content = (OpenContentInfo)item.Item;
            if (content != null)
            {
                if (!string.IsNullOrEmpty(content.VersionsJson))
                {
                    var ver = content.Versions.Single(v => v.LastModifiedOnDate == datetime);
                    if (ver != null)
                    {
                        return ver.Json;
                    }
                }
            }
            return null;
        }

        public virtual JToken GetDataVersion(DataSourceContext context, IDataItem item, DateTime datetime)
        {
            var content = (AdditionalDataInfo)item.Item;
            if (content != null)
            {
                if (!string.IsNullOrEmpty(content.VersionsJson))
                {
                    var ver = content.Versions.Single(v => v.LastModifiedOnDate == datetime);
                    if (ver != null)
                    {
                        return ver.Json;
                    }
                }
            }
            return null;
        }

        public virtual IDataItem Get(DataSourceContext context, string id)
        {
            OpenContentController ctrl = new OpenContentController();
            OpenContentInfo content = null;

            if (!string.IsNullOrEmpty(id) && id != "-1")
            {
                /*
                if (LogContext.IsLogActive)
                {
                    LogContext.Log(context.ActiveModuleId, "Get DataItem", "Request", string.Format("{0}.Get() with id {1}", Name, id));
                }
                */
                content = ctrl.GetContent(GetModuleId(context), context.Collection, id);
            }
            else
            {
                /*
                if (LogContext.IsLogActive)
                {
                    LogContext.Log(context.ActiveModuleId, "Get DataItem", "Request", string.Format("{0}.Get() with id {1}. Returning first item of module.", Name, id));
                }
                */
                content = ctrl.GetFirstContent(GetModuleId(context)); // single item
            }
            if (content == null)
            {
                Log.Logger.WarnFormat("Item not shown because no content item found. Id [{0}]. Context TabId: [{1}], ModuleId: [{2}]", id, GetTabId(context), GetModuleId(context));
                LogContext.Log(context.ActiveModuleId, "Get DataItem", "Result", "not item found with id " + id);
            }
            else if (content.ModuleId == GetModuleId(context) && content.Collection == context.Collection)
            {
                var dataItem = CreateDefaultDataItem(content);
                if (LogContext.IsLogActive)
                {
                    LogContext.Log(context.ActiveModuleId, "Get DataItem", "Result", dataItem.Data);
                }
                return dataItem;
            }
            else
            {
                if (LogContext.IsLogActive)
                {
                    LogContext.Log(context.ActiveModuleId, "Get DataItem", "Result", $"no item returned as incompatible module ids {content.ModuleId}-{GetModuleId(context)}");
                }
            }
            return null;
        }

        /// <summary>
        /// Gets additional/related data of a datasource.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <param name="scope">The Scope. (portal, tab, module, tabmodule)</param>
        /// <param name="key">The unique key in the scope</param>
        /// <returns></returns>
        public virtual IDataItem GetData(DataSourceContext context, string scope, string key)
        {
            string scopeStorage = AdditionalDataUtils.GetScope(scope, context.PortalId, context.TabId, GetModuleId(context), context.TabModuleId);
            var dc = new AdditionalDataController();
            var json = dc.GetData(scopeStorage, key);
            if (json != null)
            {
                var dataItem = new DefaultDataItem
                {
                    Data = json.Json.ToJObject("GetContent " + scope + "/" + key),
                    CreatedByUserId = json.CreatedByUserId,
                    Item = json
                };
                if (LogContext.IsLogActive)
                {
                    LogContext.Log(context.ActiveModuleId, "Get Data", key, dataItem.Data);
                }
                return dataItem;
            }
            return null;
        }

        public virtual IDataItems GetAll(DataSourceContext context)
        {
            OpenContentController ctrl = new OpenContentController();

            var dataList = ctrl.GetContents(GetModuleId(context), context.Collection)
                .OrderBy(i => i.CreatedOnDate)
                .Select(content => CreateDefaultDataItem(content));

            return new DefaultDataItems()
            {
                Items = dataList,
                Total = dataList.Count()
            };
        }


        public virtual IDataItems GetAll(DataSourceContext context, Select selectQuery)
        {
            /*
            if (LogContext.IsLogActive)
            {
                LogContext.Log(context.ActiveModuleId, "Datasource", "Context", context);
            }
            */
            if (selectQuery == null)
            {
                return GetAll(context);
            }
            else
            {
                SelectQueryDefinition def = BuildQuery(context, selectQuery);
                OpenContentController ctrl = new OpenContentController();
                SearchResults docs = LuceneController.Instance.Search(OpenContentInfo.GetScope(GetModuleId(context), context.Collection), def.Filter, def.Query, def.Sort, def.PageSize, def.PageIndex);
                int total = docs.TotalResults;
                var dataList = new List<IDataItem>();
                foreach (string item in docs.ids)
                {
                    var content = ctrl.GetContent(int.Parse(item));
                    if (content != null)
                    {
                        dataList.Add(CreateDefaultDataItem(content));
                    }
                    else
                    {
                        Log.Logger.DebugFormat("OpenContentDataSource.GetAll() ContentItem not found [{0}]", item);
                    }
                }
                return new DefaultDataItems()
                {
                    Items = dataList,
                    Total = total,
                    DebugInfo = def.Filter + " - " + def.Query + " - " + def.Sort
                };
            }
        }


        private static SelectQueryDefinition BuildQuery(DataSourceContext context, Select selectQuery)
        {
            SelectQueryDefinition def = new SelectQueryDefinition();
            def.Build(selectQuery);
            if (LogContext.IsLogActive)
            {
                var logKey = "Lucene query";
                LogContext.Log(context.ActiveModuleId, logKey, "Filter", def.Filter.ToString());
                LogContext.Log(context.ActiveModuleId, logKey, "Query", def.Query.ToString());
                LogContext.Log(context.ActiveModuleId, logKey, "Sort", def.Sort.ToString());
                LogContext.Log(context.ActiveModuleId, logKey, "PageIndex", def.PageIndex);
                LogContext.Log(context.ActiveModuleId, logKey, "PageSize", def.PageSize);
            }

            return def;
        }

        #region Query Alpaca info for Edit

        public virtual JObject GetAlpaca(DataSourceContext context, bool schema, bool options, bool view)
        {
            var fb = new FormBuilder(new FolderUri(context.TemplateFolder));
            return fb.BuildForm(context.Collection, context.CurrentCultureCode, schema, options, view);
        }

        // Additional Data
        public virtual JObject GetDataAlpaca(DataSourceContext context, bool schema, bool options, bool view, string key)
        {
            var fb = new FormBuilder(new FolderUri(context.TemplateFolder));
            return fb.BuildForm(key, context.CurrentCultureCode);
        }

        #endregion

        #endregion

        #region Commands

        public virtual void Add(DataSourceContext context, JToken data)
        {
            OpenContentController ctrl = new OpenContentController();
            var indexConfig = OpenContentUtils.GetIndexConfig(new FolderUri(context.TemplateFolder), context.Collection);
            var content = new OpenContentInfo()
            {
                ModuleId = GetModuleId(context),
                Collection = context.Collection,
                Title = data["Title"] == null ? "" : data["Title"].ToString(),
                Json = data.ToString(),
                CreatedByUserId = context.UserId,
                CreatedOnDate = DateTime.Now,
                LastModifiedByUserId = context.UserId,
                LastModifiedOnDate = DateTime.Now
            };
            ctrl.AddContent(content, context.Index, indexConfig);
        }
        public virtual void Update(DataSourceContext context, IDataItem item, JToken data)
        {
            OpenContentController ctrl = new OpenContentController();
            var indexConfig = OpenContentUtils.GetIndexConfig(new FolderUri(context.TemplateFolder), context.Collection);
            var content = (OpenContentInfo)item.Item;
            content.Title = data["Title"] == null ? "" : data["Title"].ToString();
            content.Json = data.ToString();
            content.LastModifiedByUserId = context.UserId;
            content.LastModifiedOnDate = DateTime.Now;
            ctrl.UpdateContent(content, context.Index, indexConfig);
            ClearCache(context);
        }
        public virtual void Delete(DataSourceContext context, IDataItem item)
        {
            OpenContentController ctrl = new OpenContentController();
            var content = (OpenContentInfo)item.Item;
            ctrl.DeleteContent(content, context.Index);
            ClearCache(context);
        }

        /// <summary>
        /// Perform a particular action.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <param name="action">The action.</param>
        /// <param name="item">The item to perform the action on.</param>
        /// <param name="data">The additional data/parameters needed to perform the Action.</param>
        /// <returns>Optionally return a JToken with a result value</returns>
        /// <exception cref="System.NotImplementedException"></exception>
        public virtual JToken Action(DataSourceContext context, string action, IDataItem item, JToken data)
        {
            if (action == "FormSubmit")
            {
                OpenContentController ctrl = new OpenContentController();
                var indexConfig = OpenContentUtils.GetIndexConfig(new FolderUri(context.TemplateFolder), "Submissions");
                var content = new OpenContentInfo()
                {
                    ModuleId = GetModuleId(context),
                    Collection = "Submissions",
                    Title = "Form",
                    Json = data["form"].ToString(),
                    CreatedByUserId = context.UserId,
                    CreatedOnDate = DateTime.Now,
                    LastModifiedByUserId = context.UserId,
                    LastModifiedOnDate = DateTime.Now
                };
                ctrl.AddContent(content, context.Index, indexConfig);
                return FormUtils.FormSubmit(data as JObject);                
            }
            return null;
        }

        /// <summary>
        /// Adds Related data (a.k.a Additional Data).
        /// Related data is data that is supportive to the Core data of datasource. Eg Categories, Enums, etc
        /// </summary>
        /// <param name="context">The context.</param>
        /// <param name="scope">The scope.</param>
        /// <param name="key">The key.</param>
        /// <param name="data">The data.</param>
        public virtual void AddData(DataSourceContext context, string scope, string key, JToken data)
        {
            string scopeStorage = AdditionalDataUtils.GetScope(scope, context.PortalId, context.TabId, GetModuleId(context), context.TabModuleId);
            AdditionalDataController ctrl = new AdditionalDataController();
            var additionalData = new AdditionalDataInfo()
            {
                Scope = scopeStorage,
                DataKey = key,
                Json = data.ToString(),
                CreatedByUserId = context.UserId,
                CreatedOnDate = DateTime.Now,
                LastModifiedByUserId = context.UserId,
                LastModifiedOnDate = DateTime.Now,
            };
            ctrl.AddData(additionalData);
        }

        /// <summary>
        /// Updates the Related data (a.k.a Additional Data).
        /// Related data is data that is supportive to the Core data of datasource. Eg Categories, Enums, etc
        /// </summary>
        /// <param name="context">The context.</param>
        /// <param name="item">The item.</param>
        /// <param name="data">The data.</param>
        public virtual void UpdateData(DataSourceContext context, IDataItem item, JToken data)
        {
            AdditionalDataController ctrl = new AdditionalDataController();
            var additionalData = (AdditionalDataInfo)item.Item;
            additionalData.Json = data.ToString();
            additionalData.LastModifiedByUserId = context.UserId;
            additionalData.LastModifiedOnDate = DateTime.Now;
            ctrl.UpdateData(additionalData);
            ClearCache(context);
        }

        #endregion

        #region Private Methods

        protected static int GetModuleId(DataSourceContext context)
        {
            return context.Config?["ModuleId"]?.Value<int>() ?? context.ModuleId;
        }
        private static int GetTabId(DataSourceContext context)
        {
            return context.Config?["TabId"]?.Value<int>() ?? context.TabId;
        }
        private static DefaultDataItem CreateDefaultDataItem(OpenContentInfo content)
        {
            return new DefaultDataItem
            {
                Id = content.Id,
                Collection = content.Collection,
                Title = content.Title,
                Data = content.JsonAsJToken,
                CreatedByUserId = content.CreatedByUserId,
                LastModifiedByUserId = content.LastModifiedByUserId,
                LastModifiedOnDate = content.LastModifiedOnDate,
                CreatedOnDate = content.CreatedOnDate,
                Item = content
            };
        }


        private static void ClearCache(DataSourceContext context)
        {
            UrlRewriter.UrlRulesCaching.Remove(context.PortalId, context.ModuleId);
        }

        #endregion
    }
}