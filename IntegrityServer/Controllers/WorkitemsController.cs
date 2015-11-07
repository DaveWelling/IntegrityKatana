using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;

namespace IntegrityServer.Controllers
{
    public class WorkitemsController: ApiController
    {
        private MongoClient _client;
        private IMongoDatabase _database;
        private IMongoCollection<BsonDocument> _collection;
        // ReSharper disable once InconsistentNaming
        private const int MONGO_PORT = 27017;
        // ReSharper disable once InconsistentNaming
        private const string DEFAULT_ROOT_ID = "ci8m2zuwc00024k56x11vxqxx";


        public WorkitemsController()
        {

            _client = new MongoClient("mongodb://localhost:27017");
            _database = _client.GetDatabase("integrity");
            _collection = _database.GetCollection<BsonDocument>("workitems");
        }
        public async Task<HttpResponseMessage> Get(string id)
        {
            var filter = Builders<BsonDocument>.Filter.Eq("_id", new ObjectId(id));

            BsonDocument document = await _collection.Find(filter).FirstOrDefaultAsync();
            if (document == null)
            {
                return new HttpResponseMessage(HttpStatusCode.NotFound);
            }
            document.Remove("_id");
            document.Add(new BsonElement("id", new BsonString(id)));
            string jsonString = document.ToJson(new JsonWriterSettings {OutputMode = JsonOutputMode.Strict});
            StringContent sc = new StringContent(jsonString);
            sc.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            HttpResponseMessage resp = new HttpResponseMessage(HttpStatusCode.OK) {Content = sc};
            return resp;
        }
        

        public async Task<HttpResponseMessage> Post(string id, HttpRequestMessage request)
        {
            var json = await request.Content.ReadAsStringAsync();
            //JObject intermediate = JObject.Parse(json);
            //JToken outId;
            //if (!intermediate.TryGetValue("id", out outId))
            //{
            //    return new HttpResponseMessage(HttpStatusCode.BadRequest);
            //}
            
            //var idString = string.Format("ObjectId({0})", outId.Value<string>());
            //intermediate.Add("_id", idString);
            //intermediate.Remove("id");
            var document = BsonDocument.Parse(json);
            document.Add(new BsonElement("_id", new BsonObjectId(new ObjectId(id))));
            document.Remove("id");
            var filter = Builders<BsonDocument>.Filter.Eq("_id", new ObjectId(id));
            
            var result = await _collection.ReplaceOneAsync(filter, document, new UpdateOptions { IsUpsert = true});
            
            if (result.IsAcknowledged && result.ModifiedCount == 0)
            {
                return new HttpResponseMessage(HttpStatusCode.Created);
            }
            return new HttpResponseMessage(HttpStatusCode.OK);
        }
    }
}
