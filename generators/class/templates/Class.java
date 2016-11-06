<% if (namespace || package) { %>
package <% if (namespace) { %><%= namespace %><% } %><% if (package) { %><%= package %><% } %>;<% } %>
<% if (serializable) { %>
import java.io.Serializable;
<% } %>
/**
 * <%= name %> class.
 */
<% if (visibility) { %><%= visibility %><% } %> class <%= name %><% if (serializable) { %> implements Serializable<% } %> {
  <% if (serializable) { %>private static final long serialVersionUID = 1L;<% } %>
}
