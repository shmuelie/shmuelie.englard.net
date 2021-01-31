import { dataBind, jsonLdBind } from './schema-binding.js'
import { Me } from './me.js'
import './diagnal-ribbon.js'
import { Thing } from './schema.js';

dataBind(document.querySelector("html") as HTMLElement, Me as Thing);
jsonLdBind(Me, document);